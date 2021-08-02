import { Feature, LineString, Polygon } from '@turf/helpers';
import {
  BoundingBox,
  Point,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { RouteTotals } from '@bit/garlictech.universal.gtrack.route-segment';

export interface Route extends RouteTotals {
  track: Feature<LineString>;
  bigBuffer: Feature<Polygon>;
  smallBuffer: Feature<Polygon>;
  difficulty: number;
  isRoundTrip: boolean;
  bounds: BoundingBox;
  poiSearchBox: BoundingBox;
  startPoint: Point;
  endPoint: Point;
}
