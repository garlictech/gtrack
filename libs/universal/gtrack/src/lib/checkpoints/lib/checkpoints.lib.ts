import {
  Poi,
  Point,
  Checkpoint,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { ResolvedCheckpoint } from './types';
import * as fp from 'lodash/fp';
import { PoiFp } from '@bit/garlictech.universal.gtrack.poi/lib/poi.fp';
import { distanceOnLine } from '@bit/garlictech.universal.gtrack.geometry';
import { Route } from '@bit/garlictech.universal.gtrack.route/lib/types';

export class CheckpointsLib {
  static resolveCheckpoints(
    pois: Poi[],
    checkpoints: Checkpoint[],
    route: Route
  ): ResolvedCheckpoint[] {
    const resolvePois: ResolvedCheckpoint[] = fp.flow(
      fp.filter((checkpoint: Checkpoint) => !fp.isUndefined(checkpoint.poiId)),
      fp.map(
        fp.flow(
          checkpoint => pois.find(poi => poi.id === checkpoint.poiId),
          poi =>
            fp.isUndefined(poi)
              ? undefined
              : {
                  lat: poi.lat,
                  lon: poi.lon,
                  type: PoiFp.getMostInterestingPoiType(poi.types ?? []),
                }
        )
      ),
      fp.remove(fp.isUndefined)
    )(checkpoints);

    const resolvePoints: ResolvedCheckpoint[] = fp.flow(
      fp.filter(
        (checkpoint: Checkpoint) =>
          fp.isUndefined(checkpoint.poiId) && fp.isObject(checkpoint.point)
      ),
      fp.map(({ point }: { point: Point }) => ({
        lat: point.lat,
        lon: point.lon,
        type: 'checkpoint',
      }))
    )(checkpoints);

    const sortByDistFromFn = fp.flow(
      fp.map((checkpoint: ResolvedCheckpoint) => ({
        checkpoint,
        distanceFromStart: distanceOnLine(
          route.startPoint,
          checkpoint,
          route.track
        ),
      })),
      fp.sortBy<any>(['distanceFromStart']),
      fp.map(({ checkpoint }) => checkpoint)
    );

    return fp.flow(
      () => fp.concat(resolvePois, resolvePoints),
      sortByDistFromFn
    )();
  }
}
