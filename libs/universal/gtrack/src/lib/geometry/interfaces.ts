import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';
import { Feature, LineString, Position } from '@turf/helpers';

export interface Circle {
  radius: number;
  center: Point;
}

export type PathType = Feature<LineString>;
export type GeojsonPointType = Position | [number, number, number];
