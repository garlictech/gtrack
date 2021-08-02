import { CommonModule } from '@angular/common';
import { RouterModule as StoreRouterModule } from '@bit/garlictech.angular.gtrack.router';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { HikeDetailsResolverService } from '@bit/garlictech.angular.gtrack.hike-details';
import { HikeDetailsModule } from '@bit/garlictech.angular.gtrack.hike-details-ionic';
import { Observable } from 'rxjs';
import { shareReplay, take, map } from 'rxjs/operators';
import { IonicModule } from '@ionic/angular';
import { IonicContentModule } from '@gtrack/shared/generic-ui/data-access/ionic-content.component';
import { HikeActivityControlComponentModule } from '@app/features/current-activity/hike-activity-control.component';
import {
  CurrentActivity,
  ActivityType,
} from '@app/features/current-activity/types';
import { CommonHeaderModule } from '@bit/garlictech.angular.gtrack.gtrack-header';
import { Routes, RouterModule } from '@angular/router';
import { CurrentActivityStoreModule } from '@app/features/current-activity/store/store.module';
import { ResolvedHikeData } from '@bit/garlictech.universal.gtrack.hike/lib/types';

@Component({
  selector: 'gtrack-app-hike-page',
  template: `
    <gtrack-common-header></gtrack-common-header>

    <ion-content fullscreen scroll-y="true" scroll-x="false">
      <gtrack-ionic-content>
        <gtrack-hike-details [hikeId$]="hikeId$">
          <gtrack-app-hike-activity-control
            class="activity-control"
            [activity]="currentActivity$ | async"
          ></gtrack-app-hike-activity-control>
        </gtrack-hike-details>
      </gtrack-ionic-content>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHikePageComponent {
  hikeData$: Observable<ResolvedHikeData>;
  hikeId$: Observable<string>;
  currentActivity$: Observable<CurrentActivity>;

  constructor(
    private readonly hikeDetailsResolver: HikeDetailsResolverService
  ) {
    this.hikeData$ = this.hikeDetailsResolver
      .resolve()
      .pipe(take(1), shareReplay(1));

    this.hikeId$ = this.hikeData$.pipe(map(hike => hike.hike.id));

    this.currentActivity$ = this.hikeData$.pipe(
      map(hikeData => ({
        ongoingActivityId: hikeData.hike.id,
        activityType: ActivityType.HIKING,
      }))
    );
  }
}

const routes: Routes = [
  {
    path: ':id',
    component: AppHikePageComponent,
  },
];

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreRouterModule,
    CommonModule,
    CommonHeaderModule,
    HikeDetailsModule,
    IonicContentModule,
    IonicModule,
    CurrentActivityStoreModule,
    HikeActivityControlComponentModule,
  ],
  declarations: [AppHikePageComponent],
  providers: [],
  exports: [AppHikePageComponent],
})
export class AppHikePageModule {}
