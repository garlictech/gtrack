import { GtrackDefaults } from '@bit/garlictech.universal.gtrack.defaults/defaults';
import { DifficultyFp } from '@bit/garlictech.universal.gtrack.difficulty/difficulty.fp';
import { ElevationFp } from '@bit/garlictech.universal.gtrack.elevation/lib/elevation.fp';
import {
  convertGeojsonPositionToPoint,
  lineLengthInMeters,
  PathType,
  score,
  getBoundingBoxOfTrack,
} from '@bit/garlictech.universal.gtrack.geometry';
import { BoundingBox } from '@bit/garlictech.universal.gtrack.graphql-api';
import { lineString as turfLineString, Position } from '@turf/helpers';
import turfBuffer from '@turf/buffer';
import {
  Feature,
  FeatureCollection,
  featureCollection as turfFeatureCollection,
  LineString,
  Polygon,
} from '@turf/helpers';
import * as O from 'fp-ts/lib/Option';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import * as fp from 'lodash/fp';
import { EBuffer } from '../interfaces';
import { RouteSegment } from './types';
import { pipe } from 'fp-ts/lib/function';
import { sequenceS } from 'fp-ts/lib/Apply';

const calculateTime = (
  distance: number,
  uphill: number,
  speed: number
): number => {
  const distanceInKm = distance / 1000;
  let time = (distanceInKm / speed) * 60; // minutes

  time += Math.round(uphill / 10);

  return time;
};

export class RouteSegmentFp {
  static fromCoordinatesWithElevation = (averageSpeed: number) => (
    coords: Position[]
  ): O.Option<RouteSegment> =>
    pipe(
      coords,
      O.fromNullable,
      O.chain(NEA.fromArray),
      O.map(coordinates => ({
        coordinates: O.some(coordinates),
        distance: lineLengthInMeters(coordinates),
      })),
      O.chain(sequenceS(O.option)),
      O.map(({ coordinates, distance }) => {
        const downhill = ElevationFp.calculateDownhill(coordinates);
        const uphill = ElevationFp.calculateUphill(coordinates);
        const averageTime = calculateTime(distance, uphill, averageSpeed);

        return {
          coordinates,
          distance,
          uphill,
          downhill,
          averageTime,
          score: score(distance, uphill),
          difficulty: DifficultyFp.calculateDifficulty(distance, uphill),
          startPoint: convertGeojsonPositionToPoint(NEA.head(coordinates)),
          endPoint: convertGeojsonPositionToPoint(NEA.last(coordinates)),
          geojsonFeature: turfLineString(coordinates),
          currentTime: averageTime,
        };
      })
    );

  static timeWhenSpeedIs(speed: number, segment: RouteSegment): number {
    return calculateTime(segment.distance, segment.uphill, speed);
  }

  static calculateBufferOfLines = (whichBuffer: EBuffer) => (
    lines: FeatureCollection<LineString>
  ): FeatureCollection<Polygon> =>
    turfBuffer(
      lines,
      whichBuffer === EBuffer.SMALL
        ? GtrackDefaults.smallRouteBufferSize()
        : GtrackDefaults.bigRouteBufferSize(),
      {
        units: 'meters',
      }
    );

  static calculateBufferOfLine = (whichBuffer: EBuffer) => (
    line: PathType
  ): Feature<Polygon> =>
    turfBuffer(
      line,
      whichBuffer === EBuffer.SMALL
        ? GtrackDefaults.smallRouteBufferSize()
        : GtrackDefaults.bigRouteBufferSize(),
      {
        units: 'meters',
      }
    );

  static calculatePoiSearchBox(path: PathType | PathType[]): BoundingBox {
    const featureCollection = turfFeatureCollection(
      fp.isArray(path) ? path : [path]
    );
    const _buffer = RouteSegmentFp.calculateBufferOfLines(EBuffer.BIG)(
      featureCollection
    );
    return fp.memoize(getBoundingBoxOfTrack)(_buffer);
  }
}
