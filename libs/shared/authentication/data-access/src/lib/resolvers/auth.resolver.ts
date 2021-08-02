import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { User } from '../interfaces';
import * as AuthenticationSelectors from '../+state/selectors';

@Injectable()
export class AuthResolver implements Resolve<User | boolean> {
  constructor(private readonly _store: Store) {}

  resolve(): Observable<User> {
    return this._store.pipe(
      select(AuthenticationSelectors.selectUser),
      filter(user => !!user),
      map(user => user as User),
      take(1)
    );
  }
}
