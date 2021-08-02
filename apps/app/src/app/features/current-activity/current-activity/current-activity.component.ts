import { Component, ChangeDetectionStrategy } from '@angular/core';
import * as O from 'fp-ts/lib/Option';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CurrentActivity, ActivityType } from '../types';
import { Store } from '@ngrx/store';
import { CurrentActivitySelectors } from '../store';
import { NoActivityComponentModule } from '../no-activity.component';
import { OngoingHikeComponentModule } from '../ongoing-hike/ongoing-hike.component';
import {
  HikeDetailsResolverService,
  HikeDetailsModule,
} from '@bit/garlictech.angular.gtrack.hike-details';
import { filter, map, switchMap, shareReplay } from 'rxjs/operators';
import * as fp from 'lodash/fp';
import { Track, TrackFp } from '@bit/garlictech.angular.gtrack.track';
import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { CurrentActivityStoreModule } from '../store/store.module';
import { flow } from 'fp-ts/lib/function';
import { ResolvedHikeData } from '@bit/garlictech.universal.gtrack.hike';

@Component({
  selector: 'gtrack-current-activity',
  template: `
    <gtrack-app-ongoing-hike
      *ngIf="currentActivity$ | async as currentActivity; else noActivity"
      [resolvedHike$]="resolvedHike$"
      [isMoving$]="isMoving$"
      [recordedTrack$]="recordedTrack$"
      [nextPoiToPass$]="nextPoiToPass$"
    >
    </gtrack-app-ongoing-hike>
    <ng-template #noActivity
      ><gtrack-app-no-activity></gtrack-app-no-activity
    ></ng-template>
  `,
  styleUrls: ['./current-activity.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentActivityComponent {
  currentActivity$: Observable<CurrentActivity>;
  resolvedHike$: Observable<ResolvedHikeData>;
  isMoving$: Observable<boolean>;
  recordedTrack$: Observable<Track>;
  nextPoiToPass$: Observable<Poi>;

  constructor(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly hikeDetailsResolver: HikeDetailsResolverService
  ) {
    this.currentActivity$ = this.store.select(
      CurrentActivitySelectors.getCurrentActivity
    );
    this.isMoving$ = this.store.select(CurrentActivitySelectors.isMoving);
    this.nextPoiToPass$ = this.store.select(
      CurrentActivitySelectors.nextPoiToPass
    );

    this.resolvedHike$ = this.currentActivity$.pipe(
      filter(
        currentActivity =>
          fp.isObject(currentActivity) &&
          currentActivity.activityType === ActivityType.HIKING
      ),
      map(currentActivity => currentActivity.ongoingActivityId),
      switchMap(hikeId => this.hikeDetailsResolver.resolveByHikeId(hikeId))
    );

    this.recordedTrack$ = this.store
      .select(CurrentActivitySelectors.currentRecordedRoutePositions)
      .pipe(
        map(
          flow(
            TrackFp.fromGeoPositions,
            O.getOrElse(() => undefined)
          )
        ),
        shareReplay(1)
      );
  }
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  declarations: [CurrentActivityComponent],
  imports: [
    CommonModule,
    NoActivityComponentModule,
    OngoingHikeComponentModule,
    CurrentActivityStoreModule,
    HikeDetailsModule,
  ],
  exports: [CurrentActivityComponent],
  providers: [],
})
export class CurrentActivityComponentModule {}
