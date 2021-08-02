import { RouteSegment } from '@bit/garlictech.universal.gtrack.route-segment';
import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';

export const featureName = 'admin.route-planner';

export interface State {
  segments: RouteSegment[];
  routeBuffers: {
    [key: string]: {
      shown?: boolean;
    };
  };
  routing: boolean; // Routing queries are running
  startPoint?: Point;
  failure?: string;
  waypoints?: Point[];
}
