import { LocalizationSelectors } from '@gtrack/shared/localization/data-access';
import { Inject, Injectable } from '@angular/core';
import { Store, select, Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  switchMap,
  take,
  tap,
  mapTo,
} from 'rxjs/operators';

import * as fromActions from '../../+state/actions';
import { loggedIn } from '../../+state/selectors';
import {
  AuthenticationPlatform,
  AUTHENTICATION_PLATFORM,
  EAuthRoles,
} from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    @Inject(AUTHENTICATION_PLATFORM)
    private readonly platformService: AuthenticationPlatform
  ) {
    this.platformService.onSignOn(() => {
      this.init().subscribe();
    });
    this.platformService.onSignOut(() =>
      this.store.dispatch(new fromActions.LogoutSuccess())
    );
    this.refreshSession().subscribe();
  }

  init(): Observable<void> {
    return this.platformService.getAuth().pipe(
      filter(authData => !!authData),
      tap(authData =>
        this.store.dispatch(new fromActions.AuthFinished(authData))
      ),
      take(1),
      catchError(err => {
        this.store.dispatch(new fromActions.FailureHappened(err));
        return of(err);
      })
    );
  }

  refreshSession(): Observable<void> {
    return this.platformService.isAuthenticated().pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          return this.init();
        }

        this.store.dispatch(new fromActions.AuthFinished({ token: '' }));
        return of({});
      }),
      catchError(err => {
        this.store.dispatch(new fromActions.FailureHappened(err));
        return of(err);
      }),
      take(1)
    );
  }

  logout(): Observable<boolean> {
    return this.platformService.logout();
  }

  startGoogleLogin(): Observable<boolean> {
    return this.platformService.googleLogin();
  }

  startFacebookLogin(): Observable<boolean> {
    return this.platformService.facebookLogin();
  }

  startAppleLogin(): Observable<boolean> {
    return this.platformService.appleLogin();
  }

  startMagicLinkLogin(email: string): Observable<void> {
    return this.platformService.startMagicLinkLogin(email);
  }

  finishMagicLinkLogin(token: string): Observable<boolean> {
    return this.platformService.finishMagicLinkLogin(token);
  }

  public hasGoogleLogin(): Observable<boolean> {
    return this.platformService.hasGoogleLogin();
  }

  public hasFacebookLogin(): Observable<boolean> {
    return this.platformService.hasFacebookLogin();
  }

  public isLoggedIn(): Observable<boolean> {
    return this.store.pipe(select(loggedIn));
  }

  handleSuccessfulLogin(actionCreator: () => Action): Observable<true> {
    this.store.dispatch(actionCreator());

    return this.store.select(loggedIn).pipe(
      filter(loggedIn => loggedIn),
      mapTo(true)
    );
  }

  requestMagicLink(email: string, role: EAuthRoles): Observable<true> {
    return this.store.select(LocalizationSelectors.currentLanguage).pipe(
      take(1),
      switchMap(currentLanguage =>
        this.handleSuccessfulLogin(() =>
          fromActions.requestMagicLinkToken({
            email,
            language: currentLanguage,
            roles: [role],
          })
        )
      ),
      mapTo(true)
    );
  }
}
