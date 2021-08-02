import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { Route } from '@bit/garlictech.universal.gtrack.route';
import lineSliceAlong from '@turf/line-slice-along';
import * as fp from 'lodash/fp';
import * as O from 'fp-ts/lib/Option';
import {
  RouteSegmentFp,
  EBuffer,
} from '@bit/garlictech.universal.gtrack.route-segment';
import {
  removePointsOutsideOfPolygon,
  lineStringLengthInMeters,
  PathType,
  convertGeojsonPositionToPoint,
  distanceOnLine,
} from '@bit/garlictech.universal.gtrack.geometry';
import { pairwise } from '@bit/garlictech.universal.gtrack.fp';
import {
  Point,
  Checkpoint,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import turfLength from '@turf/length';
import { PoiFp } from '@bit/garlictech.universal.gtrack.poi';

interface CheckpointInfo extends Point {
  poiId?: string;
}

const getAllPois = (
  route: Route,
  pois: Poi[],
  filterFv: {
    (pois: Poi[]): Poi[];
    (pois: Poi[]): Poi[];
    (a: { lat: number; lon: number }[]):
      | unknown[]
      | import('lodash').List<unknown>;
  }
): CheckpointInfo[] =>
  fp.flow(
    () => removePointsOutsideOfPolygon(route.smallBuffer)(pois),
    filterFv,
    fp.map(({ lat, lon, id }) => ({ lat, lon, poiId: id }))
  )();

const getAllTopPois = (route: Route, pois: Poi[]): CheckpointInfo[] =>
  getAllPois(route, pois, PoiFp.filterTopInterestPois);

const getAllSecondaryPois = (route: Route, pois: Poi[]): CheckpointInfo[] =>
  getAllPois(route, pois, PoiFp.filterSecondaryInterestPois);

export class CheckpointAdminFp {
  static getCheckpointsinLineSlice(
    route: Route,
    secondaryPois: CheckpointInfo[]
  ) {
    return (checkpoints: CheckpointInfo[]): CheckpointInfo[] => {
      const randomCheckpointFp = (poiSlice: PathType) =>
        fp.flow(
          () => lineSliceAlong(poiSlice, 0, 3.5),
          slice => slice.geometry.coordinates,
          fp.last,
          convertGeojsonPositionToPoint
        )();

      const randomSecondaryPoiFp = fp.flow(fp.shuffle, fp.first);

      const checkpointSelectorFv = (poiSlice: PathType): Point =>
        fp.flow(
          (slice: PathType) => lineSliceAlong(slice, 3, 4),
          slice => RouteSegmentFp.calculateBufferOfLine(EBuffer.SMALL)(slice),
          buffer => removePointsOutsideOfPolygon(buffer)(secondaryPois),
          pois =>
            fp.isEmpty(pois)
              ? randomCheckpointFp(poiSlice)
              : randomSecondaryPoiFp(pois)
        )(poiSlice);

      const pathLength = turfLength(route.track);

      return fp.flow(
        pairwise,
        fp.initial,
        fp.map(
          ({
            current,
            next,
          }: {
            current: CheckpointInfo;
            next: CheckpointInfo;
          }) => [
            distanceOnLine(route.startPoint, current, route.track),
            distanceOnLine(route.startPoint, next, route.track),
          ]
        ),
        fp.map(([sliceStartDistance, sliceEndDistance]) => [
          sliceStartDistance / 1000,
          (sliceEndDistance - sliceStartDistance) / 1000,
        ]),
        fp.map(fp.map(dist => (dist < 0 ? pathLength + dist : dist))),
        fp.map(([startDistance, lineLength]) => {
          return lineSliceAlong(
            route.track,
            startDistance,
            startDistance + lineLength
          );
        }),
        fp.filter((slice: PathType) => {
          const lengtEither = lineStringLengthInMeters(slice);
          return O.isSome(lengtEither) && lengtEither.value >= 7000;
        }),
        fp.first,
        slice =>
          fp.isUndefined(slice) ? undefined : checkpointSelectorFv(slice),
        (newPoint: CheckpointInfo) =>
          fp.isUndefined(newPoint)
            ? checkpoints
            : fp.flow(
                () =>
                  fp.sortBy(
                    (point: CheckpointInfo) =>
                      distanceOnLine(checkpoints[0], point, route.track),
                    [newPoint, ...fp.initial(checkpoints)]
                  ),
                pois => fp.concat(pois, fp.last(checkpoints)),
                CheckpointAdminFp.getCheckpointsinLineSlice(
                  route,
                  secondaryPois
                )
              )()
      )(checkpoints);
    };
  }

  static getCheckpoints(route: Route, pois: Poi[]): Checkpoint[] {
    return fp.flow(
      () => [route.startPoint, ...getAllTopPois(route, pois), route.endPoint],
      CheckpointAdminFp.getCheckpointsinLineSlice(
        route,
        getAllSecondaryPois(route, pois)
      ),
      fp.map(cpInfo =>
        cpInfo.poiId
          ? { poiId: cpInfo.poiId }
          : { point: { lat: cpInfo.lat, lon: cpInfo.lon } }
      )
    )();
  }
}
