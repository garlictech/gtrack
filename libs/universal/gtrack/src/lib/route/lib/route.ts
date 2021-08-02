import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import * as NEA from 'fp-ts/lib/NonEmptyArray';

import {
  getBoundingBoxOfTrack,
  convertGeojsonPositionToPoint,
} from '@bit/garlictech.universal.gtrack.geometry';
import {
  EBuffer,
  RouteSegment,
  RouteSegmentFp,
} from '@bit/garlictech.universal.gtrack.route-segment';
import { Point, RouteData } from '@bit/garlictech.universal.gtrack.graphql-api';
import {
  Position,
  lineString as turfLineString,
  isObject as isTurfObject,
  polygon,
} from '@turf/helpers';

import * as fp from 'lodash/fp';
import { pipe } from 'fp-ts/lib/function';
import { Route } from './types';
import { sequenceS } from 'fp-ts/lib/Apply';
import { Monoid } from 'fp-ts/lib/Monoid';
import { GtrackDefaults } from '../../defaults/defaults';

export const getWaypoints = (segments: RouteSegment[]): Point[] => {
  const points = fp.map('startPoint', segments);

  if (A.isNonEmpty(segments)) {
    points.push(NEA.last(segments).endPoint);
  }

  return points;
};

export class RouteFp {
  static fromRouteData(data: RouteData): O.Option<Route> {
    return pipe(
      O.fromNullable(data?.track),
      O.chain(NEA.fromArray),
      O.map(coordinates => ({
        distance: data.distance,
        uphill: data.uphill,
        downhill: data.downhill,
        bounds: data.bounds,
        averageTime: data.averageTime,
        score: data.score,
        difficulty: data.difficulty,
        isRoundTrip: data.isRoundTrip,
        poiSearchBox: data.poiSearchBox,
        track: turfLineString(coordinates),
        bigBuffer: polygon(data.bigBuffer),
        smallBuffer: polygon(data.smallBuffer),
        currentTime: data.averageTime,
        startPoint: convertGeojsonPositionToPoint(NEA.head(coordinates)),
        endPoint: convertGeojsonPositionToPoint(NEA.last(coordinates)),
      })),
      O.chain(
        O.fromPredicate(route =>
          fp.every(isTurfObject)([
            route.track,
            route.bigBuffer,
            route.smallBuffer,
          ])
        )
      )
    );
  }

  static fromRouteSegments = (averageSpeed: number) => (
    segments: RouteSegment[]
  ): O.Option<Route> => {
    return pipe(
      segments,
      A.map(segment => segment.coordinates),
      RouteFp.fromRouteSegmentCoordinates(averageSpeed)
    );
  };

  static fromRouteSegmentCoordinates = (averageSpeed: number) => (
    segmentCoordinates: Position[][]
  ): O.Option<Route> => {
    return pipe(
      segmentCoordinates,
      fp.flatten,
      NEA.fromArray,
      O.chain(RouteFp.fromCoordinates(averageSpeed))
    );
  };

  static waypointsFromRouteSegmentCoordinates(
    segmentCoordinates: Position[][]
  ): O.Option<NEA.NonEmptyArray<number>> {
    return pipe(
      segmentCoordinates,
      NEA.fromArray,
      O.map(NEA.map(segment => segment.length))
    );
  }

  static fromCoordinates = (averageSpeed: number) => (
    coordinates: Position[]
  ): O.Option<Route> => {
    return pipe(
      coordinates,
      RouteSegmentFp.fromCoordinatesWithElevation(averageSpeed),
      O.map(segment =>
        pipe(
          {
            ...segment,
            downhill: Math.round(segment.downhill),
            uphill: Math.round(segment.uphill),
            distance: Math.round(segment.distance),
            averageTime: Math.round(segment.averageTime),
            currentTime: Math.round(segment.currentTime),
            track: segment.geojsonFeature,
            bounds: getBoundingBoxOfTrack(segment.geojsonFeature),
            poiSearchBox: RouteSegmentFp.calculatePoiSearchBox(
              segment.geojsonFeature
            ),
            bigBuffer: RouteSegmentFp.calculateBufferOfLine(EBuffer.BIG)(
              segment.geojsonFeature
            ),
            smallBuffer: RouteSegmentFp.calculateBufferOfLine(EBuffer.SMALL)(
              segment.geojsonFeature
            ),
            isRoundTrip: fp.isEqual(segment.startPoint, segment.endPoint),
          },
          fp.omit(['geojsonFeature', 'coordinates'])
        )
      )
    );
  };

  static toRouteData(route: Route): O.Option<RouteData> {
    return pipe(
      {
        track: O.fromNullable(route?.track?.geometry?.coordinates),
        bigBuffer: O.fromNullable(route?.bigBuffer?.geometry?.coordinates),
        smallBuffer: O.fromNullable(route?.smallBuffer?.geometry?.coordinates),
      },
      sequenceS(O.option),
      O.map(x => ({
        ...x,
        distance: route.distance,
        uphill: route.uphill,
        downhill: route.downhill,
        averageTime: route.averageTime,
        score: route.score,
        difficulty: route.difficulty,
        bounds: route.bounds,
        isRoundTrip: route.isRoundTrip,
        poiSearchBox: route.poiSearchBox,
      }))
    );
  }

  static toRouteSegmentsByWaypoints = (waypoints: number[]) => (
    coordinates: Position[]
  ): O.Option<RouteSegment[]> => {
    interface Calculation {
      processedLength: number;
      segments: O.Option<RouteSegment>[];
    }

    const monoidCalculation: Monoid<Calculation> = {
      concat: (prev: Calculation, curr: Calculation): Calculation => ({
        processedLength: prev.processedLength + curr.processedLength,
        segments: pipe(
          coordinates.slice(
            prev.processedLength === 0 ? 0 : prev.processedLength - 1,
            prev.processedLength + curr.processedLength
          ),
          RouteSegmentFp.fromCoordinatesWithElevation(
            GtrackDefaults.averageSpeed()
          ),
          newSegment => prev.segments.concat(newSegment)
        ),
      }),
      empty: {
        processedLength: 0,
        segments: [],
      },
    };

    return pipe(
      waypoints,
      A.foldMap(monoidCalculation)(waypoint => ({
        processedLength: waypoint,
        segments: [],
      })),
      calculation => calculation.segments,
      A.array.sequence(O.option)
    );
  };
}
