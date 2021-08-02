import { Route } from '@bit/garlictech.universal.gtrack.route';
import { RouteSegment } from '@bit/garlictech.universal.gtrack.route-segment';
import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';

export interface RouteForEditor extends Route {
  segment: RouteSegment;
  waypoints: Point[];
}
