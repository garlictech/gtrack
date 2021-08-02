import { PathType } from '@bit/garlictech.universal.gtrack.geometry';
import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';
import { Position } from '@turf/helpers';

export enum EBuffer {
  SMALL = 'small',
  BIG = 'big',
}

export const emptyRouteTotals = {
  distance: 0,
  uphill: 0,
  downhill: 0,
  averageTime: 0,
  score: 0,
  currentTime: 0,
};

export type RouteTotals = typeof emptyRouteTotals;

export interface RouteSegment extends RouteTotals {
  coordinates: Position[];
  difficulty: number;
  endPoint: Point;
  startPoint: Point;
  geojsonFeature: PathType;
}
