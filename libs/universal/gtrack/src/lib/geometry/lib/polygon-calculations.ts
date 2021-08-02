import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Feature, Polygon } from '@turf/helpers';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';

export const removePointsOutsideOfPolygon = <
  POINT extends { lat: number; lon: number }
>(
  polygon: Feature<Polygon>
) => (points: POINT[]): POINT[] =>
  pipe(
    points,
    fp.reject(point => fp.some(fp.isUndefined)(point)),
    fp.filter(point =>
      isPointInsidePolygon(polygon, point as { lat: number; lon: number })
    )
  );

export function isPointInsidePolygon<
  POINT extends { lat: number; lon: number }
>(polygon: Feature<Polygon>, point: POINT): boolean {
  return turfBooleanPointInPolygon(
    [point.lon, point.lat],
    polygon.geometry as Polygon
  );
}
