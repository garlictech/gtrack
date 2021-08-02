import { GeoPosition } from '../interfaces';
import * as fp from 'lodash/fp';
import { Position } from '@turf/helpers';

export class CurrentGeolocationFp {
  static extractTimestamps(positions: GeoPosition[]): number[] {
    return fp.map((position: GeoPosition) => position.timestamp, positions);
  }

  static extractGeoPositions(positions: GeoPosition[]): (number | null | undefined)[][] {
    return fp.map(
      (position: GeoPosition) => [
        position.coords.longitude,
        position.coords.latitude,
        position.coords.altitude,
      ],
      positions
    );
  }
}
