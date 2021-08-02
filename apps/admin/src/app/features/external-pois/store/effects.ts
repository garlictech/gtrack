import { NGXLogger } from 'ngx-logger'; // eslint:disable:no-property-initializers
import * as O from 'fp-ts/lib/Option';
import { Injectable } from '@angular/core';
import { ObjectsInBufferResolverService } from '@bit/garlictech.angular.gtrack.hike-details';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { IsLoadingService } from '@service-work/is-loading';
import { RoutePlannerSelectors } from '@admin/features/route-planner/store';
import { isEmpty } from 'lodash';
import { from, Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  map,
  mergeMap,
  tap,
  withLatestFrom,
  switchMap,
} from 'rxjs/operators';
import * as fromActions from './actions';

import { ProcessRouteSegmentService } from '../services/process-route-segment.service';
import { foldObservableOption } from '@bit/garlictech.universal.gtrack.fp';

@Injectable()
export class Effects {
  constructor(
    private readonly log: NGXLogger,
    private readonly actions$: Actions,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly objectsInBuffer: ObjectsInBufferResolverService,
    private readonly isLoadingService: IsLoadingService,
    private readonly processRouteSegmentService: ProcessRouteSegmentService
  ) {}

  getGTrackPois$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.fetchGTrackPois),
        withLatestFrom(this.store.select(RoutePlannerSelectors.getRoute)),
        map(([, route]) => route),
        filter(O.isSome),
        switchMap(foldObservableOption),
        tap(() => {
          this.log.info(`Executing effect external-pois.getGTrackPois$`);
        }),
        tap(() => this.isLoadingService.add()),
        x => x,
        mergeMap(route =>
          this.objectsInBuffer.resolve(route.bigBuffer).pipe(
            map(() => fromActions.fetchGTrackPoisSuccess()),
            catchError(error =>
              of(fromActions.gtrackPoisFetchFailure({ error }))
            ),
            finalize(() => this.isLoadingService.remove()),
            tap(() => {
              this.log.info(`Finished effect external-pois.getGTrackPois$`);
            })
          )
        )
      ) as Observable<Action>
  );

  getExternalPois$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.fetchExternalPois),
        withLatestFrom(this.store.select(RoutePlannerSelectors.getRoute)),
        filter(([action, route]) => !!route && !isEmpty(action.segments)),
        tap(() => {
          this.log.info(`Executing effect external-pois.getExternalPois$`);
        }),
        tap(() => this.isLoadingService.add()),
        mergeMap(([action]) =>
          from(action.segments).pipe(
            mergeMap(
              segment => this.processRouteSegmentService.process(segment),
              1
            ),
            catchError(error =>
              of(fromActions.externalPoisFetchFailure({ error }))
            ),
            map(() => fromActions.fetchExternalPoisSuccess()),
            tap(() => {
              this.log.info(`Finished effect external-pois.getExternalPois$`);
            })
          )
        )
      ) as Observable<Action>
  );
}
