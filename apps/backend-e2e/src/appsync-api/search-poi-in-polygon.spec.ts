import { NestFactory } from '@nestjs/core';
import * as E from 'fp-ts/lib/Either';
import * as fp from 'lodash/fp';
import {
  switchMap,
  catchError,
  mergeMap,
  tap,
  switchMapTo,
  delay,
} from 'rxjs/operators';
import { PoiApiService, PoiModule } from '@bit/garlictech.nestjs.gtrack.poi';
import {
  Poi,
  CreatePoiInput,
  PlaceType,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { poiFixture } from './fixtures';
import { of, from, forkJoin, throwError } from 'rxjs';
import {
  searchByObjectId,
  resolveDataInPolygon,
} from '@bit/garlictech.universal.gtrack.graphql-data';
import { GraphqlClientService } from '@bit/garlictech.nestjs.shared.graphql';
import { buildRetryLogic } from '@bit/garlictech.universal.gtrack.fp';
import { getIdOfPoi, routeSegment } from './fixtures';
import {
  RouteSegmentFp,
  EBuffer,
} from '@bit/garlictech.universal.gtrack.route-segment';

xdescribe('POI graphql integration tests', () => {
  let poiApiService: PoiApiService;
  let graphqlClient: GraphqlClientService;

  beforeAll(async () => {
    const app = await NestFactory.createApplicationContext(PoiModule);
    poiApiService = app.get(PoiApiService);
    graphqlClient = app.get(GraphqlClientService);
  });

  test('it must be able to find items in polygon', done => {
    const poiFixtures: CreatePoiInput[] = [
      {
        ...poiFixture(),
        lon: 18.941622,
        lat: 47.54679,
        address: 'in polygon',
      },
      {
        ...poiFixture(),
        lon: 18.941622,
        lat: 48.54679,
        address: 'outside of polygon',
      },
      {
        ...poiFixture(),
        lon: 18.941623,
        lat: 47.54679,
        address: 'filtered',
      },
    ];

    const polygonFixture = RouteSegmentFp.calculateBufferOfLine(EBuffer.BIG)(
      routeSegment().geojsonFeature
    );

    const polygonSearchParams = {
      searchPolygon: polygonFixture,
      placeType: PlaceType.poi,
    };

    const polygonSearchParamsWithFilter = {
      ...polygonSearchParams,
      filters: [(poi: Poi) => poi.address !== 'filtered'],
    };

    const search$ = searchParams =>
      resolveDataInPolygon<Poi>(searchParams)({
        graphqlClient: graphqlClient.backendClient,
        queryExecutor: params => poiApiService.api.getWithQuery(params),
      });

    forkJoin(
      from(poiFixtures).pipe(
        mergeMap(poi =>
          poiApiService.api.add(poi).pipe(
            catchError(err => of(err)),
            switchMap(() =>
              searchByObjectId(getIdOfPoi(poi))(
                graphqlClient.backendClient
              ).pipe(
                tap(x => console.log(`2 :${JSON.stringify(x, null, 2)}`)),
                switchMap(result =>
                  fp.isEmpty(result) ? throwError(getIdOfPoi(poi)) : of(result)
                ),
                buildRetryLogic({})
              )
            )
          )
        )
      )
    )
      .pipe(
        delay(3000),
        switchMapTo(search$(polygonSearchParams)),
        tap(
          E.fold(
            done.fail,
            fp.flow(
              fp.map(poi => poi.id),
              poiIds =>
                fp.intersection(poiIds, [
                  getIdOfPoi(poiFixtures[0]),
                  getIdOfPoi(poiFixtures[2]),
                ]),
              fp.tap((poiIds: string[]) => expect(poiIds.length).toEqual(2))
            )
          )
        ),
        switchMapTo(search$(polygonSearchParamsWithFilter)),
        tap(
          E.fold(
            done.fail,
            fp.flow(
              fp.map(poi => poi.id),
              poiIds => fp.intersection(poiIds, [getIdOfPoi(poiFixtures[0])]),
              fp.tap((poiIds: string[]) => expect(poiIds.length).toEqual(1))
            )
          )
        )
      )
      .subscribe(
        () => done(),
        err => done.fail(err)
      );
  }, 30000);
});
