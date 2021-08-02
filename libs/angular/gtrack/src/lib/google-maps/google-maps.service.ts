import { NGXLogger } from 'ngx-logger';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as loadGoogleMapsAPI from 'load-google-maps-api';
import { GOOGLE_API_CONFIG, GoogleApiConfig } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  map: Promise<google.maps.Map>;

  constructor(
    private readonly log: NGXLogger,
    @Inject(PLATFORM_ID) platformId: Record<string, unknown>,
    @Inject(GOOGLE_API_CONFIG) config: GoogleApiConfig
  ) {
    const isBrowser = isPlatformBrowser(platformId);

    if (!isBrowser) {
      this.log.warn('Google Maps is disabled in server mode');
      this.map = new Promise(() => undefined);
    } else {
      this.map = loadGoogleMapsAPI({
        key: config.apiKey,
        libraries: ['geometry', 'places'],
      });
    }
  }

  async autocomplete(element: HTMLInputElement): Promise<any> {
    return this.map.then(() => new google.maps.places.Autocomplete(element));
  }
}
