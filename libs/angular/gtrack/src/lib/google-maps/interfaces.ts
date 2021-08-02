import { InjectionToken } from '@angular/core';

export interface GoogleApiConfig {
  apiKey: string;
}

export const GOOGLE_API_CONFIG = new InjectionToken<GoogleApiConfig>(
  'Current google config'
);
