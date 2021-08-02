import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  AuthenticationSelectors,
  AuthGuard,
} from '@gtrack/shared/authentication/data-access';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
} from 'rxjs';
import { filter, switchMap, switchMapTo, tap } from 'rxjs/operators';

import { RoleGuard } from '../role/role.guard';

/**
 * The route redirect guard is always used with the role guard.
 *
 * So, we redirect to the login page if either we are not authenticated
 * or we want to access a route with improper role.
 */
@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly _auth: AuthGuard,
    private readonly _role: RoleGuard,
    private readonly _router: Router,
    private readonly _store: Store,
    private readonly _translate: TranslateService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this._store.pipe(
      select(AuthenticationSelectors.loggingIn),
      filter(loggingIn => !loggingIn),
      switchMapTo(
        observableCombineLatest([
          this._auth.canActivate(),
          this._role.canActivate(route),
        ]).pipe(
          switchMap(results => {
            const can = results[0] && results[1];
            if (!can) {
              const noMessage = 'NO.MESSAGE.KEY';
              const message = (route.data as any).message || noMessage;
              return this._translate.get(message).pipe(
                tap(text => {
                  if (text !== noMessage) {
                   // SHOW POPUP
                  }
                  this._router
                    .navigate(['auth', 'login', { targetUrl: state.url }])
                    .catch(() => undefined);
                })
              );
            }

            return observableOf(can);
          })
        )
      )
    );
  }
}
