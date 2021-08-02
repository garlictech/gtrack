import { Position } from '@turf/helpers';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';
import { Logger } from '@bit/garlictech.nodejs.shared.bunyan-logger';
import * as fp from 'lodash/fp';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { tap, switchMap, take, map, mapTo } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import { ImageApiService } from '@bit/garlictech.nestjs.gtrack.image';
import { GraphqlClientService } from '@bit/garlictech.nestjs.shared.graphql';
import { pipe, flow } from 'fp-ts/lib/function';
import {
  Poi,
  Image,
  CreateImageInput,
  isCreateImageInput,
  isCreatePoiInput,
  CreatePoiInput,
  validateCoordinatesWithElevation,
  PlaceType,
  BoundingBox
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { PoiApiService } from '@bit/garlictech.nestjs.gtrack.poi';
import { ExternalPoiFp } from './lib/external-poi.fp';
import { ExternalPoiService } from './external-poi.service';
import { PoiSearchOutputType, ExternalPoi } from './lib/types';
import { Feature, Polygon } from '@turf/helpers';
import {
  removePointsOutsideOfPolygon,
  filterPointsCloseToReferencePoints
} from '@bit/garlictech.universal.gtrack.geometry';
import { groupPoisOnSameLocation } from './lib/group-pois-on-same-location';
import { GtrackDefaults } from '@bit/garlictech.universal.gtrack.defaults/defaults';
import { PoiFp } from '@bit/garlictech.universal.gtrack.poi';
import { getElevationOfPointsFromGoogle } from '@bit/garlictech.nodejs.shared.elevation';
import { ImageFp } from '@bit/garlictech.universal.gtrack.image';
import {
  RouteSegmentFp,
  RouteSegment,
  EBuffer
} from '@bit/garlictech.universal.gtrack.route-segment';
import { resolveDataInPolygon } from '@bit/garlictech.universal.gtrack.graphql-data';
import { DESCRIPTION_LANGUAGES_SHORT } from '@bit/garlictech.universal.gtrack.language/language.fp';

const averageSpeed = 4; // KM/H

@Injectable()
export class ProcessRouteSegmentService {
  constructor(
    private readonly poiApiService: PoiApiService,
    private readonly imageApiService: ImageApiService,
    private readonly graphqlClient: GraphqlClientService,
    private readonly externalPoiService: ExternalPoiService
  ) {}

  process(segmentCoords: Position[]): Observable<boolean> {
    Logger.info('Entering processing...');

    const createPlaceResolvers = (bigBuffer: Feature<Polygon>) => [
      resolveDataInPolygon<Poi | Image>({
        searchPolygon: bigBuffer,
        placeType: PlaceType.poi
      })({
        graphqlClient: this.graphqlClient.backendClient,
        queryExecutor: params => this.poiApiService.api.getWithQuery(params)
      }),
      resolveDataInPolygon<Poi | Image>({
        searchPolygon: bigBuffer,
        placeType: PlaceType.image
      })({
        graphqlClient: this.graphqlClient.backendClient,
        queryExecutor: params => this.imageApiService.api.getWithQuery(params)
      })
    ];

    const updatePois = (
      boundingBox: BoundingBox,
      bigBuffer: Feature<Polygon>,
      smallBuffer: Feature<Polygon>
    ) => (gtrackPois: Array<Poi | Image>) =>
      this.externalPoiService
        .get(
          boundingBox,
          DESCRIPTION_LANGUAGES_SHORT,
          ExternalPoiFp.collectObjId(gtrackPois)
        )
        .pipe(
          switchMap(externalItems =>
            this.updateGtrackPois(
              externalItems,
              gtrackPois,
              bigBuffer,
              smallBuffer
            )
          ),
          take(1)
        );

    return validateCoordinatesWithElevation(segmentCoords).pipe(
      tap(x => {
        Logger.info(
          `Route segment coordinates are valid, executing process`,
          x
        );
      }),
      switchMap(
        flow(
          RouteSegmentFp.fromCoordinatesWithElevation(averageSpeed),
          O.fold(
            () => throwError('Cannot calculate route segment'),
            x => of(x)
          ),
          map((segment: RouteSegment) => ({
            boundingBox: RouteSegmentFp.calculatePoiSearchBox(
              segment.geojsonFeature
            ),
            bigBuffer: RouteSegmentFp.calculateBufferOfLine(EBuffer.BIG)(
              segment.geojsonFeature
            ),
            smallBuffer: RouteSegmentFp.calculateBufferOfLine(EBuffer.SMALL)(
              segment.geojsonFeature
            )
          })),
          switchMap(({ bigBuffer, boundingBox, smallBuffer }) =>
            pipe(
              createPlaceResolvers(bigBuffer),
              x => forkJoin(x),
              map(
                flow(
                  fp.filter(E.isRight),
                  A.array.sequence(E.either),
                  E.map(fp.flatten)
                )
              ),
              switchMap(
                E.fold(
                  err => throwError(err),
                  x => of(x)
                )
              ),
              switchMap(updatePois(boundingBox, bigBuffer, smallBuffer))
            )
          )
        )
      ),
      tap(() => {
        Logger.info(`Finished segment processing`);
      }),
      mapTo(true)
    );
  }

  private updateGtrackPois(
    externalItems: PoiSearchOutputType,
    itemsInDb: (Poi | Image)[],
    searchPolygon: Feature<Polygon>,
    smallBuffer: Feature<Polygon>
  ): Observable<boolean> {
    const externalImages: CreateImageInput[] = (fp.filter(
      isCreateImageInput,
      externalItems
    ) as unknown) as CreateImageInput[];

    const externalPois = pipe(
      externalItems.map(item => ({ ...item, elevation: 0 })),
      fp.filter<Poi>(isCreatePoiInput)
    );

    const isGtrackPoi = (item: { id?: string; description?: unknown }) =>
      !!item.id && !!item.description;

    const gtrackItemIds = fp.map(item => item.id, itemsInDb);

    const filterExternalPoisInBuffer = (pois: Poi[]) => (
      buffer: Feature<Polygon>
    ): Poi[] =>
      pipe(
        pois,
        fp.remove<Poi>(isCreateImageInput),
        removePointsOutsideOfPolygon(buffer)
      );

    const filterGtrackPoisInBuffer = (buffer: Feature<Polygon>) =>
      fp.flow(fp.filter(isGtrackPoi), removePointsOutsideOfPolygon(buffer));

    // Get the processed pois
    const externalPoisInBigBuffer = filterExternalPoisInBuffer(externalPois)(
      searchPolygon
    );
    const gtrackPoisInBigBuffer = filterGtrackPoisInBuffer(searchPolygon)(
      itemsInDb
    );
    const allPoisInBigBuffer = fp.concat(
      gtrackPoisInBigBuffer,
      externalPoisInBigBuffer
    );

    const groupedPois: (ExternalPoi | Poi)[] = groupPoisOnSameLocation(
      GtrackDefaults.distanceOfSamePoisInMeters()
    )(allPoisInBigBuffer);

    // Get the new images
    const imagesInBigBuffer = removePointsOutsideOfPolygon(searchPolygon)(
      externalImages
    );

    const imagesCloseToPois = filterPointsCloseToReferencePoints(
      GtrackDefaults.distanceOfSamePoisInMeters(),
      groupedPois,
      imagesInBigBuffer
    );

    const imagesInSmallBuffer = removePointsOutsideOfPolygon(smallBuffer)(
      externalImages
    );

    const newImages = fp.flow(
      fp.concat(imagesInSmallBuffer),
      fp.uniq
    )(imagesCloseToPois);

    const saveNewImages = pipe(
      newImages,
      fp.filter(
        (image: CreateImageInput) =>
          !fp.includes(ImageFp.generateId(image), gtrackItemIds)
      ),
      fp.tap(x => Logger.info(`New images to save: ${x.length}`)),
      (reallyNewImages: CreateImageInput[]) =>
        fp.isEmpty(reallyNewImages)
          ? of(true)
          : this.imageApiService.api.createMultipleItems(reallyNewImages)
    );

    // Prepare pois for upsert
    const [poisToUpdate, newPois] = fp.partition(({ id }) => !!id, groupedPois);

    const poisAreTheSame = (poi1: Poi, poi2: Poi): boolean =>
      fp.isEqual(
        PoiFp.createPoiUpdateData(poi1),
        PoiFp.createPoiUpdateData(poi2)
      );

    const updatedPoisForDatabase = fp.flow(
      pois => fp.differenceWith(poisAreTheSame, pois, gtrackPoisInBigBuffer),
      fp.map(PoiFp.createPoiUpdateData),
      fp.tap(x => Logger.info(`Pois to update: ${x.length}`))
    )(poisToUpdate);

    const saveNewPois = pipe(
      newPois,
      fp.tap(x => Logger.info(`New pois to save: ${x.length}`)),
      fp.map(poi =>
        ExternalPoiFp.convertToPoiInput(poi as Readonly<ExternalPoi>, 0)
      ),
      getElevationOfPointsFromGoogle,
      switchMap(
        E.fold(
          err => throwError(err),
          x => of(x)
        )
      ),
      switchMap((pois: CreatePoiInput[]) =>
        this.poiApiService.api.createMultipleItems(pois)
      )
    );

    const updateNewPois = this.poiApiService.api.updateMultipleItems(
      updatedPoisForDatabase
    );

    // Execute the database operations
    return forkJoin([saveNewPois, saveNewImages, updateNewPois]).pipe(
      mapTo(true)
    );
  }
}
