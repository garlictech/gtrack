import {
  googleReverseGeocodingService,
  Deps,
} from '@bit/garlictech.universal.gtrack.google-maps';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { Injectable, Inject } from '@angular/core';
import {
  GOOGLE_API_CONFIG,
  GoogleApiConfig,
} from '@bit/garlictech.angular.gtrack.google-maps';

@Injectable({
  providedIn: 'root',
})
export class ReverseGeocodingService {
  private deps: Deps;

  constructor(@Inject(GOOGLE_API_CONFIG) config: GoogleApiConfig) {
    this.deps = {
      apiKey: config.apiKey,
      client: undefined,
    };
  }

  getCityFromGoogle<POINT extends { lat: number; lon: number }>(
    point: POINT
  ): OE.ObservableEither<any, string> {
    return googleReverseGeocodingService(this.deps).getCity(point);
  }
}
