import { Action } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { Observable } from 'rxjs';

export function logEffect<T extends Action>(this: any, effectName: string) {
  return (source: Observable<T>): Observable<T> =>
    source.pipe(
      tap((action: T) =>
        this.log.info(
          `Handling action '${action.type}' in effect ${effectName}`
        )
      )
    );
}
