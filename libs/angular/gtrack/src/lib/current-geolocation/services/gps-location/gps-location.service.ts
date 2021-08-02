import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable, bindCallback, from } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  share,
  switchMapTo,
} from 'rxjs/operators';
import {
  CurrentGeolocationConfig,
  EGeolocationType,
  CURRENT_GEOLOCATION_CONFIG,
  GeoPosition,
} from '../../interfaces';
 import { approximateDistance } from '@bit/garlictech.universal.gtrack.geometry';
import { Geolocation } from '@capacitor/core';


@Injectable({ providedIn: 'root' })
export class GpsLocationService {
  private _watchId: string;

  constructor(
    @Inject(PLATFORM_ID) private readonly _platformId: Record<string, unknown>,
    @Inject(CURRENT_GEOLOCATION_CONFIG)
    private readonly _config: CurrentGeolocationConfig
  ) {}

  init(): Observable<GeoPosition> {
    const watch$ = this._watchPosition().pipe(
      share(),
      filter(pos => !!pos.coords),
      distinctUntilChanged((pos1: GeoPosition, pos2: GeoPosition) => {
        const point1 = {
          lon: pos1.coords.longitude,
          lat: pos1.coords.latitude,
        };
        const point2 = {
          lon: pos2.coords.longitude,
          lat: pos2.coords.latitude,
        };

        return (
          approximateDistance(point1, point2) <= this._config.minDistance / 1000
        );
      }),
      map((pos: GeoPosition) => {
        return {
          coords: {
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            altitudeAccuracy: pos.coords.altitudeAccuracy,
            heading: pos.coords.heading,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            speed: pos.coords.speed,
          },
          timestamp: pos.timestamp,
          type: EGeolocationType.BROWSER,
        } ;
      })
    );

    if (this._isPlatformBrowser(this._platformId)) {
      if (this._watchId) {
        return from(Geolocation.clearWatch({ id: this._watchId })).pipe(
          switchMapTo(watch$)
        );
      }

      return watch$;
    }

    return EMPTY;
  }

  protected _isPlatformBrowser(platformId: Record<string, unknown>): boolean {
    return isPlatformBrowser(platformId);
  }

  private _watchPosition(): Observable<GeoPosition> {
    return bindCallback<GeoPosition>((cb: any) => {
      this._watchId = Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          maximumAge: 0,
        },
        cb
      );
    })();
  }
}
