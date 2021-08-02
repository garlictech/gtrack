import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { isArray as _isArray, some as _some } from 'lodash';
import * as fp from 'lodash/fp';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import * as GenericUiActions from '../../+state/actions';

type WatchableArgType = Observable<unknown>[] | Observable<unknown>;

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class LoaderWatchService {
  constructor(private readonly _store: Store) {
    // EMPTY
  }

  spinnerOnWorking$(
    watchables: WatchableArgType,
    message?: string
  ): Observable<unknown> {
    const watchableArray = _isArray(watchables) ? watchables : [watchables];
    const spinnerId = fp.uniqueId('spinner');

    return combineLatest(watchableArray).pipe(
      map(args => _some(args)),
      tap(working =>
        this._store.dispatch(
          working
            ? GenericUiActions.showProgressSpinner({ spinnerId, message })
            : GenericUiActions.hideProgressSpinner({ spinnerId })
        )
      ),
      finalize(() => GenericUiActions.hideProgressSpinner({ spinnerId }))
    );
  }

  setSpinnerOnWorkingForComponent(
    selectors: WatchableArgType,
    component: unknown,
    text?: string
  ): Subscription {
    return this.spinnerOnWorking$(selectors, text)
      .pipe(untilDestroyed(component))
      .subscribe();
  }
}
