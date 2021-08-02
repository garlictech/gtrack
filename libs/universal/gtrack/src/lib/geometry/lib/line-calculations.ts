import distance from '@turf/distance';
import {
  lineString as turfLineString,
  Position,
  Feature,
  LineString,
} from '@turf/helpers';
import length from '@turf/length';
import turfLength from '@turf/length';
import lineSlice from '@turf/line-slice';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { convertPointToTurfPoint } from './point-transformations';
import { PathType } from '../interfaces';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

export function distanceFromRoute<POINT extends { lat: number; lon: number }>(
  point: POINT,
  path: Feature<LineString>
): number {
  const tPoint = convertPointToTurfPoint(point);
  const pointOnRoute = nearestPointOnLine(path, tPoint);

  return Math.round(
    distance(tPoint, pointOnRoute, { units: 'kilometers' }) * 1000
  );
}

/** Calculate the linestring between two snapped pontint of a linestring. First, snap all the points to the line, then return the slice between the snapped points.-m-20 */
export function snappedLineSlice<
  POINT1 extends { lat: number; lon: number },
  POINT2 extends { lat: number; lon: number }
>(start: POINT1, end: POINT2, path: Feature<LineString>): Feature<LineString> {
  return lineSlice(
    convertPointToTurfPoint(start),
    convertPointToTurfPoint(end),
    path
  );
}

/**
 * Snap points to the given line and return with the segment's length, plus the point distances from the path.
 */
export function distanceOnLine<
  POINT1 extends { lat: number; lon: number },
  POINT2 extends { lat: number; lon: number }
>(start: POINT1, end: POINT2, path: Feature<LineString>): number {
  const startDistanceFromPath = distanceFromRoute(start, path);
  const endDistanceFromPath = distanceFromRoute(end, path);
  const pathBetweenSnappedPoints = snappedLineSlice(start, end, path);
  const snappedPathLength =
    length(pathBetweenSnappedPoints, { units: 'kilometers' }) * 1000;

  return startDistanceFromPath + endDistanceFromPath + snappedPathLength;
}

export const lineLengthInMeters = (
  lineCoordinates: Position[]
): O.Option<number> =>
  O.tryCatch(
    () =>
      turfLength(turfLineString(lineCoordinates), { units: 'kilometers' }) *
      1000
  );

export const lineStringLengthInMeters = (line: PathType): O.Option<number> =>
  pipe(
    O.fromNullable(line?.geometry?.coordinates),
    O.chain(lineLengthInMeters)
  );
