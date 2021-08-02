import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AuthenticationSelectors } from '@gtrack/shared/authentication/data-access';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const enabledRole = route.data.enabledRole;

    return this._store.pipe(
      select(AuthenticationSelectors.selectRole),
      map(actualRole => actualRole === enabledRole)
    );
  }
}
