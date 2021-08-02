import { HttpClient } from '@bit/garlictech.nestjs.shared.http';
import { buildRetryLogic } from '@bit/garlictech.universal.gtrack.fp';

import * as Joi from 'joi';
import { pipe as fptsPipe } from 'fp-ts/lib/function';
import { map as fptsMap, isSome, Option } from 'fp-ts/lib/Option';
import { Logger } from '@bit/garlictech.nodejs.shared.bunyan-logger';
import {
  Circle,
  getCenterRadiusOfBox,
} from '@bit/garlictech.universal.gtrack.geometry';
import { GtrackDefaults } from '@bit/garlictech.universal.gtrack.defaults/defaults';
import {
  poiSourceSchema,
  CreateImageInput,
  BoundingBox,
  PoiSource,
  TextualDescriptionType,
  longitudeSchema,
  latitudeSchema,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import * as fp from 'lodash/fp';
import * as _ from 'lodash';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  expand,
  map,
  switchMap,
  take,
  toArray,
} from 'rxjs/operators';
import { ExternalPoiFp } from './lib/external-poi.fp';
import { PoiSearchOutputType, ExternalPoi, GoogleApiConfig } from './lib/types';
import { Injectable } from '@nestjs/common';
import { validateSchema } from '@bit/garlictech.universal.gtrack.joi-validator';

export const PLACE_API_URL = 'https://maps.googleapis.com/maps/api/place';

//const hiddenTypes = ['premise', 'political'];

interface GoogleData {
  objectType?: PoiSource;
  languageKey?: string;
  place_id: string;
  website?: string;
  formatted_address?: string;
  international_phone_number?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name?: string;
  types?: string[];
}

const googleDataSchema = {
  objectType: poiSourceSchema,
  languageKey: Joi.string(),
  place_id: Joi.string().required(),
  website: Joi.string(),
  formatted_address: Joi.string(),
  international_phone_number: Joi.string(),
  geometry: {
    location: {
      lat: latitudeSchema,
      lng: longitudeSchema,
    },
  },
  name: Joi.string(),
  types: Joi.array().items(Joi.string()),
};

export const {
  validate: validateGoogleData,
  isType: isGoogleData,
} = validateSchema<GoogleData>(googleDataSchema);

const createImagesFromPhotoData = (
  poi: ExternalPoi | undefined,
  apiKey: string
) => (photos: any[]): CreateImageInput[] => {
  if (!poi) {
    return [];
  }

  const thumbnailWidth = GtrackDefaults.thumbnailWidthInPixel();
  const cardWidth = GtrackDefaults.cardImageWidthInPixel();

  return fp.map(
    (photo: any) =>
      ({
        lat: poi.lat,
        lon: poi.lon,
        original: {
          url: `${PLACE_API_URL}/photo?maxwidth=${photo.width}&photoreference=${photo.photo_reference}&key=${apiKey}`,
          width: photo.width,
          height: photo.height,
        },
        card: {
          url: `${PLACE_API_URL}/photo?maxwidth=${ExternalPoiFp.cardImageWidth()}&photoreference=${
            photo.photo_reference
          }&key=${apiKey}`,
          width: cardWidth,
          height: Math.round((cardWidth * photo.height) / photo.width),
        },
        thumbnail: {
          url: `${PLACE_API_URL}/photo?maxwidth=${ExternalPoiFp.thumbnailImageWidth()}&photoreference=${
            photo.photo_reference
          }&key=${apiKey}`,
          width: thumbnailWidth,
          height: Math.round((thumbnailWidth * photo.height) / photo.width),
        },
        sourceObject: {
          objectType: PoiSource.google,
          objectId: `${poi.sourceObject[0].objectId}-${photos.indexOf(photo)}`,
        },
        attributions: JSON.stringify(photo.attributions),
      } as CreateImageInput)
  )(photos);
};

@Injectable()
export class GooglePoiService {
  private readonly googleApiConfig: GoogleApiConfig;

  constructor(private readonly _http: HttpClient) {
    this.googleApiConfig = { apiKey: process.env.GOOGLE_API_KEY || '' };
  }

  get(
    bounds: BoundingBox,
    alreadyProcessedSourceObjectIds: string[] = []
  ): Observable<PoiSearchOutputType> {
    // eslint-disable-next-line prefer-rest-params
    Logger.info(
      `Google poi fetch started with params ${JSON.stringify(
        [bounds, alreadyProcessedSourceObjectIds],
        null,
        2
      )}`
    );

    const resultOption: Option<Observable<PoiSearchOutputType>> = fptsPipe(
      getCenterRadiusOfBox(bounds),
      fptsMap((circle: Circle) => {
        const url = `${PLACE_API_URL}/nearbysearch/json`;

        const getPage = (pagetoken?: string) =>
          fp.flow(
            () => ({
              params: {
                location: `${circle.center.lat},${circle.center.lon}`,
                radius: circle.radius.toString(),
                key: this.googleApiConfig.apiKey,
                cahcheBreaker: _.uniqueId(Math.random().toString()),
              },
            }),
            httpQueryParams => ({
              params: pagetoken
                ? { ...httpQueryParams.params, pagetoken }
                : httpQueryParams.params,
            }),
            httpQueryParams =>
              this._http.get(url, httpQueryParams).pipe(
                delay(2000),
                map((data: any) => ({
                  items: fp.map('place_id')(data.results),
                  pageToken: data.next_page_token,
                }))
              )
          )();

        return getPage().pipe(
          buildRetryLogic({ logger: Logger }),
          expand(({ pageToken }) => (pageToken ? getPage(pageToken) : EMPTY)),
          concatMap(({ items }) => items),
          toArray(),
          switchMap(placeIds =>
            this._getPoiDetails(placeIds, alreadyProcessedSourceObjectIds)
          )
        );
      })
    );

    return isSome(resultOption) ? resultOption.value : of([]);
  }

  private _getPoiDetails(
    objectIds: string[],
    alreadyProcessedSourceObjectIds: string[]
  ): Observable<PoiSearchOutputType> {
    const pickUsedFields = (data: unknown, schema: unknown): GoogleData =>
      fp.flow(
        () => fp.keys(schema),
        schemaKeys => (fp.pick(schemaKeys, data) as unknown) as GoogleData,
        data => ({
          ...data,
          geometry: {
            location: data && data.geometry && data.geometry.location,
          },
        })
      )();

    const createPoi = (data: GoogleData): ExternalPoi | undefined =>
      isGoogleData(data)
        ? {
            sourceObject: [
              {
                objectType: PoiSource.google,
                languageKey: 'en_US',
                objectId: data.place_id,
                url: data.website,
              },
            ],
            address: data.formatted_address,
            phoneNumber: data.international_phone_number,
            openingHours: _.get(data, 'opening_hours.periods'),
            lat: data.geometry.location.lat,
            lon: data.geometry.location.lng,
            description: [
              {
                languageKey: 'en_US',
                title: data.name,
                type: TextualDescriptionType.markdown,
              },
            ],
            types: data.types,
            elevation: -1,
            id: '',
          }
        : undefined;

    const newObjectIds = fp.flow(
      fp.filter(
        (objectId: string) =>
          !fp.includes(
            ExternalPoiFp.idFromSourceObject(PoiSource.google, objectId),
            alreadyProcessedSourceObjectIds
          )
      )
    )(objectIds);

    // execute search for the same place on different languages.
    // merge the descriptions
    return fp.isEmpty(newObjectIds)
      ? of([])
      : forkJoin(
          fp.map((objectId: string) =>
            this._http
              .get(`${PLACE_API_URL}/details/json`, {
                params: {
                  placeid: objectId,
                  key: this.googleApiConfig.apiKey,
                  language: 'en',
                },
              })
              .pipe(
                take(1),
                map(response => {
                  const returnedPoiData = pickUsedFields(
                    response.result,
                    googleDataSchema
                  );
                  const externalPoi = createPoi(returnedPoiData);

                  const imageInputs: CreateImageInput[] = createImagesFromPhotoData(
                    externalPoi,
                    this.googleApiConfig.apiKey
                  )(response.result && response.result.photos);

                  return externalPoi ? [externalPoi, ...imageInputs] : [];
                }),
                catchError(err => {
                  Logger.error(`Error in google poi fetch ${objectId}: ${err}`);
                  return of([]);
                })
              )
          )(newObjectIds)
        ).pipe(map(fp.flatten));
  }
}
