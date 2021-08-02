import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operator/map';

export class MockStore<T> extends BehaviorSubject<T> {
  constructor(_initialState: T) {
    super(_initialState);
  }

  dispatch = (action: Action): void => {
    //
  };

  select = <P, R>(pathOrMapFn: any, ...paths: string[]): Observable<R> =>
    map.call(this, pathOrMapFn);
}
