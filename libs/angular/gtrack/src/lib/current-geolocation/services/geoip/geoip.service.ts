import { NGXLogger } from 'ngx-logger';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError, delay, map, retryWhen, take, tap } from 'rxjs/operators';
import {
  CURRENT_GEOLOCATION_CONFIG,
  CurrentGeolocationConfig,
  EGeolocationType,
  GeoPosition,
} from '../../interfaces';

@Injectable({ providedIn: 'root' })
export class GeoIpService {
  private readonly _url: string;

  constructor(
    private readonly log: NGXLogger,
    private readonly _http: HttpClient,
    @Inject(CURRENT_GEOLOCATION_CONFIG)
    private readonly _config: CurrentGeolocationConfig
  ) {
    this._url = `${this._config.endpoint}/geoip`;
  }

  init(): Observable<GeoPosition> {
    return this._http
      .get<{
        accuracy: number;
        latitude: number;
        longitude: number;
      }>(this._url)
      .pipe(
        take(1),
        tap(body => this.log.debug('GeoIP result: ', body)),
        map(body => ({
          coords: {
            accuracy: body.accuracy,
            altitude: undefined,
            altitudeAccuracy: undefined,
            heading: undefined,
            latitude: body.latitude,
            longitude: body.longitude,
            speed: undefined,
          },
          timestamp: Date.now(),
          type: EGeolocationType.GEOIP,
        })),
        catchError(ipErr => {
          this.log.error('Current ip error: ', ipErr);

          return throwError(ipErr);
        }),
        retryWhen(errors => errors.pipe(delay(1000), take(3)))
      );
  }
}
