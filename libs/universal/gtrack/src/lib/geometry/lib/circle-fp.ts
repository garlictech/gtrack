import * as fp from 'lodash/fp';
import { Circle } from '../interfaces';
import { approximateDistance } from './geospatial-calculations';
import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';

export class CircleFp {
  /**
   * Uses the approximate distance formulae, so it can be used inly in small circles
   *
   */
  static filterPointsInSmallCircle(points: Point[], circle: Circle): Point[] {
    return fp.filter(fp.curry(CircleFp.isPointInSmallCircle)(circle), points);
  }

  static isPointInSmallCircle(circle: Circle, point: Point): boolean {
    return approximateDistance(point, circle.center) <= circle.radius;
  }
}
