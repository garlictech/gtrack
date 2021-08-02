import * as O from 'fp-ts/lib/Option';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as RoutePlannerActions from '@admin/features/route-planner/store/actions';
import * as RoutePlannerSelectors from '@admin/features/route-planner/store/selectors';
import { of } from 'rxjs';
import { filter, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { WaypointMarkerService } from '../services';
import { foldObservableOption } from '@bit/garlictech.universal.gtrack.fp';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class Effects {
  getAdminMapData$ = of('NOMAPID').pipe(
    filter(mapId => !!mapId),
    filter(adminMap => !!adminMap)
  );

  deletePlan$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RoutePlannerActions.deletePlan),
        tap(action =>
          this.log.info(
            `Handling action '${action.type}' in effect waypoint-markers.deletePlan$`
          )
        ),
        tap(() => this.waypointMarkerService.reset())
      ),
    { dispatch: false }
  );

  resetMapOnError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RoutePlannerActions.routingError),
        switchMap(() => this.store.select(RoutePlannerSelectors.getRoute)),
        filter(O.isSome),
        switchMap(foldObservableOption),
        withLatestFrom(
          this.getAdminMapData$,
          this.store.select(RoutePlannerSelectors.getWaypoints)
        ),
        tap(() =>
          this.log.info(`Executing effect waypoint-markers.resetMapOnError$`)
        )
        //tap(([, adminMap, waypoints]) =>
        //this.waypointMarkerService.setWaypoints(adminMap, waypoints)
        // )
      ),
    { dispatch: false }
  );

  constructor(
    private readonly log: NGXLogger,
    private readonly actions$: Actions,
    private readonly waypointMarkerService: WaypointMarkerService,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>
  ) {}
}
