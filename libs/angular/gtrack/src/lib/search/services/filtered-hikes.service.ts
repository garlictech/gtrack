import { Injectable } from '@angular/core';
import { HikeFp, CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { HikeService } from '@bit/garlictech.angular.gtrack.hike-details';
import { Store } from '@ngrx/store';
import * as fp from 'lodash/fp';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import * as SearchFiltersSelectors from '../store/selectors';

@Injectable({ providedIn: 'root' })
export class FeaturedHikesService {
  constructor(
    private readonly hikeService: HikeService,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>
  ) {}

  currentFilteredHikes$: Observable<CalculatedHike[]> = combineLatest([
    this.hikeService.entities$,
    this.store.select(SearchFiltersSelectors.getFilters),
  ]).pipe(
    filter(([hikes, filters]) => !!hikes && !!filters),
    map(([hikes, filters]) =>
      fp.flow(
        fp.filter((hike: CalculatedHike) =>
          fp.inRange(
            filters.difficulty[0],
            filters.difficulty[1] + 1,
            hike.route.difficulty
          )
        ),
        fp.filter(
          (hike: CalculatedHike) =>
            // upper limit may be undefined, that means unlimited upper limit
            hike.route.distance >= filters.length[0] &&
            (filters.length[1]
              ? hike.route.distance <= filters.length[1]
              : true)
        ),
        fp.filter(
          (hike: CalculatedHike) =>
            // upper limit may be undefined, that means unlimited upper limit
            hike.route.averageTime >= filters.time[0] &&
            (filters.time[1] ? hike.route.averageTime <= filters.time[1] : true)
        ),
        fp.filter(
          fp.curry(HikeFp.isHikeEndpointInCircle)({
            center: filters.center,
            radius: filters.radius,
          })
        )
      )(hikes)
    ),
    shareReplay(1)
  );
}
