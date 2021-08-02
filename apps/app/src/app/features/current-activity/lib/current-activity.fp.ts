import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { Route } from '@bit/garlictech.universal.gtrack.route';
import * as fp from 'lodash/fp';
import { isPointInsidePolygon } from '@bit/garlictech.universal.gtrack.geometry/lib/polygon-calculations';

export class CurrentActivityFp {
  static PassedPois(allPois: Poi[], currentRoute: Route): Poi[] {
    return fp.flow(
      () => currentRoute.smallBuffer,
      buffer => fp.filter(poi => isPointInsidePolygon(buffer, poi), allPois)
    )();
  }
}
