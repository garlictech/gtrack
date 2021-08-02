import { CurrentActivity } from '../types';
import { GeoPosition } from '@bit/garlictech.angular.gtrack.current-geolocation';
import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';

export interface State {
  currentActivity?: CurrentActivity;
  isMoving: boolean;
  recordedCoordinates: GeoPosition[];
  allPassedPois: Poi[];
  newPassedPois: Poi[];
  nextPoiToPass?: Poi;
}

export const featureName = 'app.current-activity';
