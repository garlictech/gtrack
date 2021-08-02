import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import * as fromSelectors from '../../+state/selectors';

@Injectable({
  providedIn: 'root',
})
export class NotAuthGuard implements CanActivate {
  constructor(private readonly _store: Store) {}

  canActivate(): Observable<boolean> {
    return this._store.pipe(
      select(fromSelectors.loggingIn),
      filter(loggingIn => !loggingIn),
      switchMap(() => this._store.pipe(select(fromSelectors.loggedOut)))
    );
  }
}
