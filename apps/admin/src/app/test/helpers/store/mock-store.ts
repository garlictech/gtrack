import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Action } from '@ngrx/store';

export class MockStore<T> extends BehaviorSubject<T> {
  constructor(private _initialState: T) {
    super(_initialState);
  }

  dispatch = (action: Action): void => {
    //
  };

  select = <P, R>(pathOrMapFn: any, ...paths: string[]): Observable<R> => {
    return map.call(this, pathOrMapFn);
  };
}
