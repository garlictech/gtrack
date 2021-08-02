// eslint:disable: no-var-requires
import { sequenceS } from 'fp-ts/lib/Apply';
import { Logger } from '@bit/garlictech.nodejs.shared.bunyan-logger';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';

import {
  CreatePlace,
  CreatePlaceInput,
  DeletePlace,
  PlaceType,
  TextualDescription,
  HikeData,
  Poi,
  Image,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { Handler, DynamoDBRecord } from 'aws-lambda';
import * as fp from 'lodash/fp';
import { forkJoin, Observable, of, from } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
require('cross-fetch/polyfill');
import * as appsync from 'aws-appsync';
import { AWSAppSyncClientOptions } from 'aws-appsync';
import { flow, pipe, Lazy } from 'fp-ts/lib/function';
import { tagImage } from '../image-tagger/image-tagger';
import { createDbObjects } from './lib/elasticsearch-indexer.fp';

const stage = process.env.STAGE;
const service = process.env.SERVICE;

const configObj: AWSAppSyncClientOptions = {
  url: process.env.GRAPHQL_ENDPOINT || '',
  region: process.env.AWS_REGION || '',
  auth: {
    type: appsync.AUTH_TYPE.AWS_IAM,
    credentials: {
      accessKeyId: process.env.GRAPHQL_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.GRAPHQL_SECRET_ACCESS_KEY || '',
    },
  },
  disableOffline: true,
};

const graphqlClient = new appsync.AWSAppSyncClient(configObj);

const reduceTitles = (descriptions: TextualDescription[]): string =>
  pipe(descriptions, fp.map('title'), fp.join(' '));

const convertToPoint = flow(
  fp.map(flow(fp.toNumber, O.fromNullable)),
  A.array.sequence(O.option)
);

const generatePlaceFromHike = (
  dbObject: HikeData
): O.Option<CreatePlaceInput[]> => {
  const firstPoint = pipe(
    dbObject.route.track[0],
    firstPoint => [firstPoint[0] /* lon */, firstPoint[1] /* lat */],
    convertToPoint
  );

  const lastPoint = pipe(
    dbObject.route.track,
    fp.last,
    O.fromNullable,
    O.map(coords => [coords[0] /* lon */, coords[1] /* lat */]),
    O.chain(convertToPoint)
  );

  return pipe(
    [firstPoint, lastPoint],
    A.array.sequence(O.option),
    O.map(
      fp.map(point => ({
        lon: point[0],
        lat: point[1],
        objectId: dbObject.id,
        type: PlaceType.hike,
        title: reduceTitles(dbObject.description),
      }))
    )
  );
};

const generatePlaceFromImage = (
  dbObject: Image
): O.Option<CreatePlaceInput[]> =>
  pipe(
    [dbObject.lon, dbObject.lat],
    convertToPoint,
    O.map(([lon, lat]) => [
      {
        lat,
        lon,
        objectId: dbObject.id,
        type: PlaceType.image,
      },
    ])
  );

const generatePlaceFromPoi = (dbObject: Poi): O.Option<CreatePlaceInput[]> =>
  pipe(
    [dbObject.lon, dbObject.lat],
    convertToPoint,
    O.map(([lon, lat]) => [
      {
        lat,
        lon,
        objectId: dbObject.id,
        type: PlaceType.poi,
        title: reduceTitles(dbObject.description),
      },
    ])
  );
const placeGenerationMap: Record<
  string,
  | typeof generatePlaceFromHike
  | typeof generatePlaceFromImage
  | typeof generatePlaceFromPoi
> = {};

placeGenerationMap[`${service}-${stage}-images`] = generatePlaceFromImage;
placeGenerationMap[`${service}-${stage}-pois`] = generatePlaceFromPoi;
placeGenerationMap[`${service}-${stage}-hikes`] = generatePlaceFromHike;

type DbObject = {
  object: HikeData | Poi | Image;
  tableName: string;
  eventName: DynamoDBRecord['eventName'];
};

export const handler: Handler = (event: any): Promise<any> => {
  Logger.debug(`Obtained event: ${JSON.stringify(event, null, 2)}`);

  return pipe(createDbObjects(event), executeIndexing).toPromise();
};

export const executeIndexing = (dbObjects: DbObject[]): Observable<any> => {
  const createTask = (task: Lazy<Promise<any>>, label: string) =>
    pipe(
      task(),
      from,
      tap(result =>
        Logger.info(`${label} OK: ${JSON.stringify(result, null, 2)}`)
      ),
      catchError(err => {
        Logger.error(`${label} ERROR: ${JSON.stringify(err, null, 2)}`);
        return of(false);
      })
    );

  const deleteIndexTask$ = (objectId: string) =>
    createTask(
      () =>
        graphqlClient.mutate({
          mutation: DeletePlace,
          variables: { objectId },
        }),
      'DELETE'
    );

  const createIndexTask$ = (input: CreatePlaceInput) =>
    createTask(
      () =>
        graphqlClient.mutate({ mutation: CreatePlace, variables: { input } }),
      'CREATE'
    );

  const isRemovedRecord = (object: DbObject) => object.eventName === 'REMOVE';

  const isUpdatedRecord = (object: DbObject) => object.eventName === 'MODIFY';

  const deletePlaces$ = pipe(
    dbObjects,
    fp.filter(fp.anyPass([isRemovedRecord, isUpdatedRecord])),
    fp.map((object: DbObject) => object.object.id),
    fp.map(deleteIndexTask$),
    observables =>
      fp.isEmpty(observables) ? of([true]) : forkJoin(observables)
  );

  const createPlace = ({ tableName, object }) =>
    placeGenerationMap[tableName]?.(object);

  const getImageUrl = (object: DbObject['object']) =>
    O.fromNullable((object as Image).card?.url);

  const createPlaceData = pipe(
    dbObjects,
    fp.filter(fp.negate(isRemovedRecord)),
    fp.map(object => ({
      imageUrl: getImageUrl(object.object),
      places: createPlace(object),
    })),
    fp.filter(({ places }) => O.isSome(places))
  );

  const tagImage$ = (imageUrl: string, place: CreatePlaceInput) =>
    of(true).pipe(
      switchMap(() => tagImage(imageUrl)),
      tap(() =>
        Logger.debug(`Tagged image: ${JSON.stringify(place, null, 2)}`)
      ),
      map((imageIsGood: boolean) => ({
        ...place,
        processed: true,
        banned: !imageIsGood,
      }))
    );

  const indexPlace$ = flow(
    fp.tap(place => {
      Logger.debug(`Indexing place: ${JSON.stringify(place, null, 2)}`);
    }),
    createIndexTask$
  );

  const ordinaryPlaceHandler$ = pipe(
    createPlaceData,
    fp.filter(({ imageUrl, places }) => O.isNone(imageUrl) && O.isSome(places)),
    fp.map(({ places }) => O.fold(() => [], fp.identity)(places)),
    fp.map(fp.map(indexPlace$)),
    fp.flatten,
    observables =>
      fp.isEmpty(observables) ? of([true]) : forkJoin(observables)
  );

  const imageHandler$ = pipe(
    createPlaceData,
    fp.filter(({ imageUrl, places }) => O.isSome(imageUrl) && O.isSome(places)),
    fp.map(sequenceS(O.option)),
    A.array.sequence(O.option),
    O.map(
      fp.map(({ imageUrl, places }) =>
        tagImage$(imageUrl, places[0]).pipe(switchMap(indexPlace$))
      )
    ),
    O.fold(
      () => of(false),
      observables =>
        fp.isEmpty(observables) ? of(true) : forkJoin(observables)
    )
  );

  return deletePlaces$.pipe(
    switchMap(() => forkJoin(imageHandler$, ordinaryPlaceHandler$))
  );
};
