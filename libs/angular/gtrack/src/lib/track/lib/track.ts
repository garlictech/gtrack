import * as fp from 'lodash/fp';
import { Route, RouteFp } from '@bit/garlictech.universal.gtrack.route';
import {
  GeoPosition,
  CurrentGeolocationFp,
} from '@bit/garlictech.angular.gtrack.current-geolocation';
import * as O from 'fp-ts/lib/Option';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/function';

export interface Track {
  route: Route;
  timestamps: number[];
  startTime: Date;
  endTime: Date;
  fullTime: number;
  movingTime: number;
  currentSpeed: number;
  averageSpeed: number;
  climbed: number;
  descended: number;
  passedOnroutePois: number;
  passedOffroutePois: number;
}

export class TrackFp {
  static fromGeoPositions(positions: GeoPosition[]): O.Option<Track> {
    const startTime = positions[0] && positions[0].timestamp;
    const endTime = fp.last(positions) && fp.last(positions).timestamp;

    return pipe(
      positions,
      NEA.fromArray,
      O.map(CurrentGeolocationFp.extractGeoPositions),
      O.chain(RouteFp.fromCoordinates(0)),
      O.map(route => ({
        timestamps: CurrentGeolocationFp.extractTimestamps(positions),
        route,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        fullTime: (endTime - startTime) / 1000, // in seconds
        movingTime: 0,
        currentSpeed: 0,
        averageSpeed: 0,
        climbed: 0,
        descended: 0,
        passedOnroutePois: 0,
        passedOffroutePois: 0,
      }))
    );
  }
}
