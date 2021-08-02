import { NGXLogger } from 'ngx-logger';
import { Injectable } from '@angular/core';
import { HikeService } from '@bit/garlictech.angular.gtrack.hike-details';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fp from 'lodash/fp';
import {
  distinctUntilChanged,
  filter,
  finalize,
  switchMap,
  tap
} from 'rxjs/operators';

import * as SearchFilterActions from './actions';
import * as SearchFiltersSelectors from './selectors';
import { PlaceType } from '@bit/garlictech.universal.gtrack.graphql-api';

@Injectable()
export class Effects {
  searchCircleChanges$ = createEffect(
    () =>
      this.store.select(SearchFiltersSelectors.getFilters).pipe(
        tap(() =>
          this.log.debug(`Entering effect search.searchCircleChanges$`)
        ),
        filter(
          searchFilters => !!searchFilters && fp.isObject(searchFilters.center)
        ),
        distinctUntilChanged(
          (previousFilters, currentFilters) =>
            fp.isEqual(previousFilters.center, currentFilters.center) &&
            previousFilters.radius >= currentFilters.radius
        ),
        tap(() =>
          this.log.info(`Executing effect search.searchCircleChanges$`)
        ),
        tap(() => this.store.dispatch(SearchFilterActions.SearchingStarted())),
        switchMap(({ center, radius }) =>
          this.hikeService
            .searchInCircle({
              circle: { center, radius },
              placeType: PlaceType.hike
            })
            .pipe(
              finalize(() =>
                this.store.dispatch(SearchFilterActions.SearchingFinished())
              )
            )
        ),
        tap(() => this.log.info(`finished effect search.searchCircleChanges$`))
      ),
    { dispatch: false }
  );

  constructor(
    private readonly log: NGXLogger,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly hikeService: HikeService
  ) {}
}
