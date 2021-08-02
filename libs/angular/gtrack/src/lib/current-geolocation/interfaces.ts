import { InjectionToken } from '@angular/core';
export enum EGeolocationPermissionState {
  GRANTED = 'granted',
  PROMPT = 'prompt',
  DENIED = 'denied',
  UNKNOWN = 'unknown',
}

export enum EGeolocationType {
  GEOIP = 'geoip',
  BROWSER = 'browser',
}

export interface GeoPositionError {
  code: number;
  message: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  altitudeAccuracy?: number;
}

export interface GeoPosition {
  coords: GeoCoordinates;
  timestamp: number;
  type: EGeolocationType;
}

export interface CurrentGeolocationConfig {
  debug: boolean;
  interval: number;
  minDistance: number;
  timeOut: number;
  endpoint: string;
}

export const CURRENT_GEOLOCATION_CONFIG = new InjectionToken<
  CurrentGeolocationConfig
>('Current geolocation config');
