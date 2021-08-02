import { NGXLogger } from 'ngx-logger'; // eslint:disable:no-property-initializers
import * as O from 'fp-ts/lib/Option';
import { Injectable } from '@angular/core';
import { HikeDetailsResolverService } from '@bit/garlictech.angular.gtrack.hike-details';
import { PoiService } from '@bit/garlictech.angular.gtrack.poi';
import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { createEffect } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { RoutePlannerSelectors } from '@admin/features/route-planner';
import { includes, isEmpty, isEqual, map as _map, union } from 'lodash';
import * as fp from 'lodash/fp';
import { combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
  take,
} from 'rxjs/operators';
import * as fromActions from './actions';
import * as HikeEditorSelectors from './selectors';
import {
  CalculatedHike,
  CalculatedHikeFp,
} from '@bit/garlictech.universal.gtrack.hike';
import { RouteFp, Route } from '@bit/garlictech.universal.gtrack.route';
import { GtrackDefaults } from '@bit/garlictech.universal.gtrack.defaults/defaults';
import { foldObservableOption } from '@bit/garlictech.universal.gtrack.fp';
import { flow } from 'fp-ts/lib/function';
import {
  HikeStop,
  HikeStopFp,
} from '@bit/garlictech.universal.gtrack.hike-stops';
import {
  HikeStopSelectors,
  HikeStopActions,
} from '@bit/garlictech.angular.gtrack.hike-stops/store';

@Injectable()
export class Effects {
  updateHikeStops$ = createEffect(() =>
    combineLatest([
      this.poiService.entities$,
      this.store.select(HikeEditorSelectors.getCalculatedHike),
    ]).pipe(
      debounceTime(500),
      filter(
        ([pois, hike]) =>
          fp.isObject(hike) && fp.isObject(hike.route) && !isEmpty(pois)
      ),
      distinctUntilChanged(isEqual),
      tap(() => this.log.info(`Executing effect hike-editor.updateHikeStops$`)),
      withLatestFrom(this.store.select(HikeStopSelectors.selectAllHikeStops)),
      map(
        ([[pois, hike], hikeStops]: [[Poi[], CalculatedHike], HikeStop[]]) => {
          const currentPoiIds = _map(pois, 'id');

          const updatedHikeStops = fp.flow(
            fp.filter((stop: HikeStop) => includes(currentPoiIds, stop.poi.id)),
            fp.map(stop =>
              HikeStopFp.create(stop.poi, hike.route, hike.data.id)
            )
          )(hikeStops);

          const newPoiIds = fp.flow(
            fp.map((stop: HikeStop) => stop.poi.id),
            fp.difference(currentPoiIds)
          )(hikeStops);

          const newHikeStops = fp.flow(
            fp.filter((poi: Poi) => includes(newPoiIds, poi.id)),
            fp.map(poi => HikeStopFp.create(poi, hike.route, hike.data.id))
          )(pois);

          return union(updatedHikeStops, newHikeStops);
        }
      ),
      map(stops => HikeStopActions.AddHikeStops({ stops })),
      tap(() => this.log.info(`Finished effect hike-editor.updateHikeStops$`))
    )
  );

  setDirty$ = createEffect(() =>
    this.store.select(HikeEditorSelectors.getHike).pipe(
      distinctUntilChanged(fp.isEqual),
      filter(fp.isObject),
      withLatestFrom(this.store.select(HikeEditorSelectors.isDirty)),
      filter(([, isDirty]) => !isDirty),
      tap(() => this.log.info(`Executing effect hike-editor.setDirty$`)),
      map(() => fromActions.setHikeEditorDirtyState({ state: true }))
    )
  );

  updateHikeRoute$ = createEffect(() =>
    this.store.select(RoutePlannerSelectors.getSegments).pipe(
      distinctUntilChanged(fp.isEqual),
      tap(() => this.log.info(`Executing effect hike-editor.updateHikeRoute$`)),
      map(
        flow(
          RouteFp.fromRouteSegments(GtrackDefaults.averageSpeed()),
          O.chain((route: Route) => RouteFp.toRouteData(route))
        )
      ),
      filter(O.isSome),
      switchMap(foldObservableOption),
      map(route =>
        fromActions.updateHike({
          hikeProperties: {
            route,
          },
        })
      )
    )
  );

  updateResolvedHike$ = createEffect(
    () =>
      this.store.select(HikeEditorSelectors.getHike).pipe(
        distinctUntilChanged(fp.isEqual),
        tap(() =>
          this.log.info(`Executing effect 'hike-editor.updateResolvedHike$'`)
        ),
        map(CalculatedHikeFp.fromHikeData),
        filter(O.isSome),
        switchMap(hike => this.hikeResolver.resolveHike(hike.value)),
        take(1),
        map(resolvedHike => fromActions.updateResolvedHike({ resolvedHike })),
        tap(() =>
          this.log.info(`Finishing effect 'hike-editor.updateResolvedHike$'`)
        )
      ) as Observable<Action>
  );

  constructor(
    private readonly log: NGXLogger,
    private readonly poiService: PoiService,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly hikeResolver: HikeDetailsResolverService
  ) {}
}
