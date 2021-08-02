import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';

export interface SearchFilters {
  difficulty: [number, number];
  time: [number, number];
  length: [number, number];
  location: string;
  radius: number;
  center: Point;
}
