import { NGXLogger } from 'ngx-logger'; // eslint:disable:no-property-initializers
import { Injectable, NgZone } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, take, tap } from 'rxjs/operators';
import { GeoPosition } from '../interfaces';

import { GeoLocationService } from '../services';
import * as LocalActions from './actions';
import { LocalStorageService } from '@bit/garlictech.angular.gtrack.local-storage';
import { Store } from '@ngrx/store';

@Injectable()
export class CurrentGeolocationEffects {
  constructor(
    private readonly log: NGXLogger,
    private readonly _geolocationService: GeoLocationService,
    private readonly _actions$: Actions,
    private readonly _localStorage: LocalStorageService,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly ngZone: NgZone
  ) {}

  startPositioning$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType<LocalActions.StartPositioning>(
          LocalActions.CurrentGeolocationActionTypes.START_POSITIONING
        ),
        take(1),
        switchMap(() => this._geolocationService.init()),
        tap((result: GeoPosition) => {
          this.log.debug(`Current position: ${JSON.stringify(result)}`);

          this._localStorage.setObject('lastLocation', result);
          this.ngZone.run(() => {
            this.store.dispatch(
              new LocalActions.CurrentLocationObtained(result)
            );
          });
        })
      ),
    { dispatch: false }
  );
}
