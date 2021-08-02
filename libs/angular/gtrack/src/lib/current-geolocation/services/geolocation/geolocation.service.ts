import { NGXLogger } from 'ngx-logger';
import { GeolocationPermissionService } from './../geolocation-permission';
import { Store, select } from '@ngrx/store';
import { Platform } from '@ionic/angular';
import { selectCurrentLocation } from './../../store/selectors';
import { Injectable } from '@angular/core';
import { GpsLocationService } from '../gps-location';
import { GeoIpService } from '../geoip';
import { Observable, from, of, EMPTY, merge } from 'rxjs';
import { GeoPosition, EGeolocationPermissionState } from '../../interfaces';
import {
  switchMap,
  filter,
  take,
  takeUntil,
  switchMapTo,
  catchError,
  map,
  mapTo,
  shareReplay,
} from 'rxjs/operators';
import { LocalStorageService } from '@bit/garlictech.angular.gtrack.local-storage';
import * as localActions from '../../store/actions';
import { PermissionResult } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class GeoLocationService {
  private _gpsLocation$: Observable<GeoPosition>;
  private _geoIp$: Observable<GeoPosition>;
  private _localStore$: Observable<GeoPosition>;
  private _showAlert$: Observable<boolean>;

  constructor(
    private readonly log: NGXLogger,
    private readonly _store: Store,
    private readonly _platform: Platform,
    private readonly _gpsService: GpsLocationService,
    private readonly _geoIpService: GeoIpService,
    private readonly _localStorage: LocalStorageService,
    private readonly _geolocationPermissionService: GeolocationPermissionService
  ) {
    this._showAlert$ = this._geolocationPermissionService
      .showPermissionAlert()
      .pipe(
        map(() => {
          this._store.dispatch(new localActions.StartPositioning());
          return true;
        }),
        shareReplay(1)
      );
  }

  init(): Observable<GeoPosition> {
    return from(this._platform.ready()).pipe(
      switchMap(() => {
        this._localStore$ = of(
          this._localStorage.getObject('lastLocation')
        ).pipe(
          filter(location => !!location),
          take(1)
        );
        this._gpsLocation$ = this._gpsService.init().pipe(
          catchError(err => {
            this.log.error(`Location error: ${err}`);
            return EMPTY;
          })
        );
        this._geoIp$ = this._geoIpService
          .init()
          .pipe(takeUntil(this._gpsLocation$));

        return merge(
          this._localStore$,
          this._geoIp$.pipe(takeUntil(this._gpsLocation$)),
          this._gpsLocation$
        );
      })
    );
  }

  getLocation(): Observable<GeoPosition | undefined> {
    return this._geolocationPermissionService.checkGeolocationPermission().pipe(
      switchMap((result: PermissionResult | undefined) =>
        !result?.state || result?.state === EGeolocationPermissionState.PROMPT
          ? this._showAlert$
          : of(this._store.dispatch(new localActions.StartPositioning())).pipe(
              mapTo(true)
            )
      ),
      switchMap(() =>
        this._geolocationPermissionService
          .waitGeolocationDecision()
          .pipe(switchMapTo(this._store.pipe(select(selectCurrentLocation))))
      )
    );
  }
}
