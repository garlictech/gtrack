import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { AuthRedirects } from '../../interfaces';
import * as fromSelectors from '../../+state/selectors';
import {
  RouterActions,
  RouterSelectors,
} from '@gtrack/shared/router/data-access';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly _store: Store) {}

  canActivate(): Observable<boolean> {
    const redirectCheck$ = (loggedIn: boolean) =>
      this._store.select(RouterSelectors.selectRouteData).pipe(
        take(1),
        tap(
          (data: AuthRedirects) =>
            data?.redirectIfUnauth &&
            !loggedIn &&
            this._store.dispatch(
              new RouterActions.Replace(data.redirectIfUnauth)
            )
        ),
        mapTo(loggedIn)
      );

    return this._store.pipe(
      select(fromSelectors.loggingIn),
      filter(loggingIn => !loggingIn),
      switchMap(() => this._store.select(fromSelectors.loggedIn)),
      switchMap(redirectCheck$)
    );
  }
}
