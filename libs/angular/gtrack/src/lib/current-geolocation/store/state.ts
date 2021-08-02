import { GeoPosition } from '../interfaces';

export interface CurrentGeolocationState {
  currentLocation?: GeoPosition;
  tracking: boolean;
}

export const featureName = 'features.common.current-geolocation';
