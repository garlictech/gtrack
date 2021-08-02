import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HikeService } from '@bit/garlictech.angular.gtrack.hike-details';
import { Store } from '@ngrx/store';
import * as fp from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { RoutePlannerActions } from '@admin/features/route-planner/store/';
import { HikeEditorFp } from '../lib/hike-editor.fp';
import { HikeEditorActions } from '../store';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

import { RouteFp } from '@bit/garlictech.universal.gtrack.route';

@Injectable({ providedIn: 'root' })
export class HikeEditorResolveGuard implements Resolve<boolean> {
  constructor(
    private readonly title: Title,
    private readonly store: Store<unknown>,
    private readonly hikeService: HikeService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const activateNewHike = () => {
      this.title.setTitle('New hike');
      return of(true);
    };

    const activateExistingHike = (hikeId: string) => {
      this.title.setTitle('Edit hike');

      return this.hikeService.getByKey(hikeId).pipe(
        tap(hike => {
          this.store.dispatch(
            HikeEditorActions.updateHike({ hikeProperties: hike.data })
          );

          pipe(
            RouteFp.toRouteSegmentsByWaypoints(hike.data.segments)(
              hike.data.route.track
            ),
            O.map(
              fp.map(segment =>
                RoutePlannerActions.routeSegmentCreated({ segment })
              )
            ),
            actions =>
              O.isSome(actions)
                ? actions.value.forEach(action => this.store.dispatch(action))
                : true,
            () => of(true)
          );
        }),
        mapTo(true)
      );
    };

    return pipe(route.params.id, id =>
      (HikeEditorFp.isNewHikeId(id) ? activateNewHike : activateExistingHike)(
        id
      )
    );
  }
}
