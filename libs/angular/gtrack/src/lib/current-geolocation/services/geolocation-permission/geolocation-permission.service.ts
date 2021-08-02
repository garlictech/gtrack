import { NGXLogger } from 'ngx-logger';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Plugins, PermissionType, PermissionResult } from '@capacitor/core';
import { from, Observable, forkJoin, EMPTY, of } from 'rxjs';
import {
  switchMap,
  mapTo,
  expand,
  last,
  delay,
  take,
  map,
  catchError,
} from 'rxjs/operators';

const { Permissions } = Plugins;

@Injectable({ providedIn: 'root' })
export class GeolocationPermissionService {
  constructor(
    private readonly log: NGXLogger,
    private readonly _alertCtrl: AlertController,
    private readonly _translateService: TranslateService
  ) {}

  checkGeolocationPermission(): Observable<PermissionResult | undefined> {
    return from(Permissions.query({ name: PermissionType.Geolocation })).pipe(
      catchError(err => {
        this.log.error(
          `Error in getting the geolocation permission from the browser: ${err}`
        );
        return of(undefined);
      }),
       take(1),
       map((result: PermissionResult | undefined) => result)
    );
  }

  waitGeolocationDecision(): Observable<boolean> {
    return this.checkGeolocationPermission().pipe(
      expand((res?: PermissionResult | undefined ) => {
        if (res?.state !== 'prompt') {
          return EMPTY;
        }
        return this.checkGeolocationPermission().pipe(delay(1000));
      }),
      last(),
      mapTo(true)
    );
  }

  // async showDeniedPermissionAlert(): Promise<any> {
  //   const alert = await this._alertCtrl.create({
  //     header: this._translateService.instant('geolocation.deniedPermissionTitle'),
  //     message: this._translateService.instant('geolocation.deniedPermissionMessage'),
  //     buttons: ['OK'],
  //   });

  //   await alert.present();
  // }

  showPermissionAlert(): Observable<boolean> {
    return forkJoin([
      this._translateService.get('geolocation.permissionTitle'),
      this._translateService.get('geolocation.permissionMessage'),
    ]).pipe(
      switchMap(([header, message]) =>
        from(
          this._alertCtrl.create({
            header,
            message,
            buttons: ['Ok'],
          })
        )
      ),
      switchMap(alert =>
        from(alert.present()).pipe(
          switchMap(() => from(alert.onDidDismiss()).pipe(mapTo(true)))
        )
      )
    );
  }
}
