import { NGXLogger } from 'ngx-logger';
import { CheckpointAdminFp } from '@bit/garlictech.universal.gtrack.checkpoints-admin';
import { Injectable } from '@angular/core';
import { LoaderWatchService } from '@gtrack/shared/generic-ui/data-access';
import { RouteSegment } from '@bit/garlictech.universal.gtrack.route-segment';
import {
  Point,
  Checkpoint,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as HikeEditorActions from '@admin/features/hike-editor/store/actions';
import { every, isEmpty, last } from 'lodash';
import { combineLatest, forkJoin, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
  take,
  finalize,
} from 'rxjs/operators';
import * as fp from 'lodash/fp';
import { RoutePlannerApiService } from '../services/route-planner-api.service';
import * as RoutePlannerActions from './actions';
import * as RoutePlannerSelectors from './selectors';
import * as HikeEditorSelectors from '@admin/features/hike-editor/store/selectors';
import {
  CalculatedHike,
  ResolvedHikeData,
} from '@bit/garlictech.universal.gtrack.hike';
import { HikeStop } from '@bit/garlictech.universal.gtrack.hike-stops';
import { HikeStopSelectors } from '@bit/garlictech.angular.gtrack.hike-stops/store';

@Injectable()
export class Effects {
  spinnerOnRouting$ = createEffect(
    () =>
      this.loaderWatch.spinnerOnWorking$(
        this.store.select(RoutePlannerSelectors.getIsRouting),
        'routing'
      ),
    { dispatch: false }
  );

  deletePlan$ = createEffect(() =>
    this._actions$.pipe(
      ofType(RoutePlannerActions.deletePlan),
      map(() => HikeEditorActions.resetHike())
    )
  );

  addRouteSegment$ = createEffect(() =>
    this._actions$.pipe(
      ofType(RoutePlannerActions.addWaypoint),
      map(action => action.wayPoint),
      withLatestFrom(this.store.select(RoutePlannerSelectors.getRouteEndPoint)),
      filter(res => every(res, item => !!item)),
      tap(() =>
        this.log.info(`Executing effect 'route-planner.addRouteSegment$'`)
      ),
      switchMap(([newSegmentLastPoint, newSegmentFirstPoint]) =>
        this.routePlannerApiService.getRoute(
          newSegmentFirstPoint,
          newSegmentLastPoint
        )
      ),
      map(segment => RoutePlannerActions.routeSegmentCreated({ segment }))
    )
  );

  addStartPoint$ = createEffect(() =>
    this._actions$.pipe(
      ofType(RoutePlannerActions.addWaypoint),
      withLatestFrom(
        this.store.select(RoutePlannerSelectors.getRouteStartPoint)
      ),
      filter(([, startPoint]) => !startPoint),
      tap(() =>
        this.log.info(`Executing effect 'route-planner.addStartPoint$'`)
      ),
      map(([action]) =>
        RoutePlannerActions.setStartPoint({ startPoint: action.wayPoint })
      )
    )
  );

  waypointMoved$ = createEffect(() =>
    this._actions$.pipe(
      ofType(RoutePlannerActions.waypointMoved),
      withLatestFrom(this.store.select(RoutePlannerSelectors.getSegments)),
      filter(
        ([action, segments]) =>
          !isEmpty(segments) && action.waypointIndex <= segments.length
      ),
      tap(() =>
        this.log.info(`Executing effect 'route-planner.waypointMoved$'`)
      ),
      switchMap(([action, segments]) => {
        const newEdgePoints = this.getNewEdgePointsOnWaypointMove(
          action.waypointIndex,
          action.newPoint,
          segments
        );

        return forkJoin(
          newEdgePoints.map(pointPair =>
            this.routePlannerApiService.getRoute(pointPair[0], pointPair[1])
          )
        ).pipe(
          mergeMap(newSegments =>
            newSegments.map((newSegment, i) =>
              RoutePlannerActions.replaceSegment({
                newSegment,
                segmentIndex:
                  action.waypointIndex === 0 ? 0 : action.waypointIndex - 1 + i,
              })
            )
          ),
          catchError(error => of(RoutePlannerActions.routingError({ error })))
        );
      })
    )
  );

  startpointMoved$ = createEffect(() =>
    this._actions$.pipe(
      ofType(RoutePlannerActions.waypointMoved),
      withLatestFrom(this.store.select(RoutePlannerSelectors.noSegments)),
      filter(
        ([action, noSegments]) => action.waypointIndex === 0 && noSegments
      ),
      tap(() =>
        this.log.info(`Executing effect 'route-planner.startpointMoved$'`)
      ),
      map(([action]) =>
        RoutePlannerActions.setStartPoint({ startPoint: action.newPoint })
      )
    )
  );

  closeCircle$ = createEffect(() =>
    this._actions$.pipe(
      ofType(RoutePlannerActions.closeCircle),
      withLatestFrom(
        combineLatest([
          this.store.select(RoutePlannerSelectors.canCloseCircle),
          this.store.select(RoutePlannerSelectors.getRouteStartPoint),
        ])
      ),
      filter(([, [canClose]]) => canClose),
      tap(() => this.log.info(`Executing effect 'route-planner.closeCircle$'`)),
      map(([, [, startPoint]]) => startPoint),
      map(startPoint =>
        RoutePlannerActions.addWaypoint({ wayPoint: startPoint })
      )
    )
  );

  generateCheckpoints$ = createEffect(() =>
    this._actions$.pipe(
      ofType(RoutePlannerActions.generateCheckpoints),
      tap(() =>
        this.log.info(`Entering effect 'route-planner.generateCheckpoints$'`)
      ),
      switchMap(() =>
        this.store.select(HikeEditorSelectors.getResolvedHike).pipe(
          take(1),
          filter(fp.isObject),
          map((resolvedHike: ResolvedHikeData) => resolvedHike.hike),
          switchMap((hike: CalculatedHike) =>
            this.store
              .select(
                HikeStopSelectors.onrouteHikeStopsSortedByDistanceFromOrigo(
                  hike.id
                )
              )
              .pipe(
                take(1),
                filter(fp.negate(fp.isEmpty)),
                tap(() =>
                  this.log.info(
                    `Executing effect 'route-planner.generateCheckpoints$'`
                  )
                ),
                map(
                  fp.flow(
                    fp.map((stop: HikeStop) => stop.poi),
                    onroutePois =>
                      CheckpointAdminFp.getCheckpoints(hike.route, onroutePois),
                    (checkpoints: Checkpoint[]) =>
                      HikeEditorActions.updateHike({
                        hikeProperties: { checkpoints },
                      })
                  )
                ),
                finalize(() =>
                  this.log.info(
                    `Finishing effect 'route-planner.generateCheckpoints$'`
                  )
                )
              )
          )
        )
      )
    )
  );

  constructor(
    private readonly log: NGXLogger,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly _actions$: Actions,
    private readonly routePlannerApiService: RoutePlannerApiService,
    private readonly loaderWatch: LoaderWatchService
  ) {}

  private getNewEdgePointsOnWaypointMove(
    waypointIndex: number,
    newPoint: Point,
    segments: RouteSegment[]
  ): Point[][] {
    let newEdgePoints: Point[][];

    if (waypointIndex === 0) {
      newEdgePoints = [[newPoint, segments[0].endPoint]];
    } else if (waypointIndex === segments.length) {
      newEdgePoints = [[last(segments).startPoint, newPoint]];
    } else {
      const firstSegment = segments[waypointIndex - 1];
      const secondSegment = segments[waypointIndex];

      newEdgePoints = [
        [firstSegment.startPoint, newPoint],
        [newPoint, secondSegment.endPoint],
      ];
    }

    return newEdgePoints;
  }
}
