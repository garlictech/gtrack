import { NGXLogger } from 'ngx-logger';
import { Injectable } from '@angular/core';
import { AuthenticationActions } from '@gtrack/shared/authentication/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap } from 'rxjs/operators';

import { CustomerService } from '../services/customer.service';
import * as LocalActions from './actions';

@Injectable()
export class Effects {
  fetchCustomerAfterSuccessfullLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AuthenticationActions.AuthFinished>(
        AuthenticationActions.AuthenticationActionTypes.AUTH_FINISHED
      ),
      filter(action => !!action.auth?.user),
      mapTo(LocalActions.customerFetch())
    )
  );

  customerFetch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocalActions.customerFetch),
      mergeMap(() => {
        this.log.debug(`Effect: Customer data fetch start initiated`);
        return this.settingsService.getCustomer().pipe(
          map(customer => {
            this.log.debug(`Effect: new settings data arrived:`, customer);
            return LocalActions.customerFetchSuccess({ customer });
          }),
          catchError(error => of(LocalActions.customerFetchFailure({ error })))
        );
      })
    )
  );

  /* userProfileSave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocalActions.userProfileSave),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.select(AuthenticationSelectors.selectCustomerId)
          )
        )
      ),
      mergeMap(([{ profile }, customerId]) =>
        this.settingsService.udpateProfile(customerId, profile).pipe(
          settingsAndProfileFromCustomer,
          flatMap(data => [
            LocalActions.userProfileSaveSuccess(),
            LocalActions.customerFetchSuccess(data),
            fromGenericUiActions.displayToast({ summary: 'Profile saved' }),
          ]),
          catchError(error =>
            of(LocalActions.userProfileSaveFailure({ error }))
          )
        )
      )
    )
  );

  userSettingsSave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocalActions.userSettingsSave),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.select(AuthenticationSelectors.selectCustomerId),
            this.store.select(fromSettingsStore.selectSettings)
          )
        )
      ),
      mergeMap(([{ settings }, customerId, oldSettingsInStore]) =>
        this.settingsService
          .updateSettings(customerId, {
            ...oldSettingsInStore,
            ...settings,
          } as any)
          .pipe(
            settingsAndProfileFromCustomer,
            flatMap(data => [
              LocalActions.userSettingsSaveSuccess(),
              LocalActions.customerFetchSuccess(data),
              fromGenericUiActions.displayToast({ summary: 'Settings saved' }),
            ]),
            catchError(error =>
              of(LocalActions.userSettingsSaveFailure({ error }))
            )
          )
      )
    )
  );*/

  constructor(
    private readonly log: NGXLogger,
    private readonly actions$: Actions,
    private readonly settingsService: CustomerService
  ) {
    this.log.debug('Initializing customer effects...');
  }
}
