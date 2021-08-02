import { NGXLogger } from 'ngx-logger'; // eslint:disable:no-property-initializers no-identical-functions
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { IsLoadingService } from '@service-work/is-loading';
import * as fp from 'lodash/fp';
import { from, Observable, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { AuthService } from '../services/auth/auth.service';
import * as LocalActions from './actions';
import * as AuthenticationSelectors from './selectors';
import {
  RouterActions,
  RouterSelectors,
} from '@gtrack/shared/router/data-access';

@Injectable()
export class Effects {
  @Effect({ dispatch: false }) googleLogin$: Observable<
    boolean
  > = this._actions$.pipe(
    ofType(LocalActions.googleLogin),
    switchMap(() => {
      this.log.debug('Effect: Google login initiated');

      return this._auth.startGoogleLogin();
    })
  );

  @Effect({ dispatch: false }) facebookLogin$: Observable<
    boolean
  > = this._actions$.pipe(
    ofType(LocalActions.facebookLogin),
    switchMap(() => {
      this.log.debug('Effect: Facebook login initiated');

      return this._auth.startFacebookLogin();
    })
  );

  @Effect({ dispatch: false }) appleLogin$: Observable<
    boolean
  > = this._actions$.pipe(
    ofType(LocalActions.appleLogin),
    switchMap(() => {
      this.log.debug('Effect: Apple login initiated');

      return this._auth.startAppleLogin();
    })
  );

  @Effect() magiclinkRequestToken$: Observable<Action> = this._actions$.pipe(
    ofType(LocalActions.requestMagicLinkToken),
    switchMap(action => {
      this.log.debug('Effect: Magic Link login initiated');

      return this._auth.startMagicLinkLogin(action.email).pipe(
        map(() => {
          this.log.info('Effect: Magic Link email sent');

          return new LocalActions.MagicLinkEmailSent();
        }),
        catchError(err => {
          this.log.error('Effect: Magic Link email sending', err);

          return of(new LocalActions.FailureHappened(err));
        })
      );
    })
  );

  @Effect({ dispatch: false }) magiclinkLogin$: Observable<
    boolean
  > = this._actions$.pipe(
    ofType<LocalActions.MagicLinkLogin>(
      LocalActions.AuthenticationActionTypes.MAGICLINK_LOGIN
    ),
    switchMap(action => {
      this.log.debug('Effect: Magic Link login continued');

      return from(this._auth.finishMagicLinkLogin(action.token));
    })
  );

  magicLinkEmailSent$ = createEffect(
    () =>
      this.store.select(AuthenticationSelectors.magicLinkEmailSent).pipe(
        filter(emailSent => !!emailSent),
        tap(() => {
          this.log.info('Magic Link email sent');
          this.store.dispatch(new RouterActions.Go(['auth', 'email-sent']));
        })
      ),
    {
      dispatch: false,
    }
  );

  @Effect() logout$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.LogoutStart>(
      LocalActions.AuthenticationActionTypes.LOGOUT_START
    ),
    switchMap(() => {
      this.log.debug('Effect: Logout initiated');

      return from(this._auth.logout()).pipe(
        map(() => {
          this.log.info('Effect: Logout success');

          return new LocalActions.LogoutSuccess();
        }),
        catchError(err => {
          this.log.error('Effect: Logout error', err);

          return of(new LocalActions.FailureHappened(err));
        })
      );
    })
  );

  @Effect({ dispatch: false }) unauthorized$: Observable<
    unknown
  > = this._actions$.pipe(
    ofType<LocalActions.Unauthorized>(
      LocalActions.AuthenticationActionTypes.UNAUTHORIZED
    ),
    switchMap(() => this._auth.refreshSession())
  );

  handleSpinner$ = createEffect(
    () =>
      this.store
        .select(AuthenticationSelectors.loggingIn)
        .pipe(
          tap(loggingIn =>
            loggingIn
              ? this.isLoadingService.add()
              : this.isLoadingService.remove()
          )
        ),
    {
      dispatch: false,
    }
  );

  handleRedirectAfterLogin$ = createEffect(() =>
    this.store.select(AuthenticationSelectors.loggedIn).pipe(
      withLatestFrom(this.store.select(RouterSelectors.selectRouteData)),
      distinctUntilChanged(fp.isEqual),
      filter(
        ([loggedIn, routeData]) =>
          loggedIn && !!routeData?.redirectAfterAuthSuccess
      ),
      map(
        ([, routeData]) =>
          new RouterActions.Replace(routeData.redirectAfterAuthSuccess)
      )
    )
  );

  loginFailed$ = createEffect(
    () =>
      this.store.select(AuthenticationSelectors.loginFailed).pipe(
        filter(failed => !!failed),
        tap(() => {
          this.log.error('Login failed');
        })
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private readonly log: NGXLogger,
    private readonly _actions$: Actions,
    private readonly _auth: AuthService,
    private isLoadingService: IsLoadingService,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>
  ) {}
}
