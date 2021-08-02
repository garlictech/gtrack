import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';
import {
  point as turfPoint,
  Position,
  Feature,
  Point as TurfPoint,
} from '@turf/helpers';
import { Option, fromNullable, mapNullable, map } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

export function convertPointToTurfPoint<
  POINT extends { lat: number; lon: number }
>(point: POINT): Feature<TurfPoint> {
  return turfPoint([point.lon, point.lat]);
}

export const convertGeojsonPositionToPoint = (
  geojsonPoint: Position
): Point => {
  return {
    lat: geojsonPoint[1],
    lon: geojsonPoint[0],
    elevation: geojsonPoint[2],
  };
};

export const convertPointToGeojsonPosition = (point: Point): Position => {
  return [point.lon, point.lat, point.elevation as number];
};

export const convertGeojsonPositionToTurfPoint = (
  point: Position
): Feature<TurfPoint> => {
  return turfPoint(point);
};

export const convertGeojsonPointFeatureToPoint = (
  point: Feature<TurfPoint>
): Option<Point> => {
  return pipe(
    fromNullable(point.geometry),
    mapNullable(geometry => geometry.coordinates),
    map((coordinates: Position) => ({
      lat: coordinates[1],
      lon: coordinates[0],
      elevation: coordinates[2],
    }))
  );
};
