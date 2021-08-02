import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

import { HikeDetailsModule } from '@bit/garlictech.angular.gtrack.hike-details-ionic';
import { Observable } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as routerSelectors from '@bit/garlictech.angular.gtrack.router/store/selectors';

@Component({
  selector: 'gtrack-hike-page',
  template: ` <gtrack-hike-details [hikeId$]="hikeId$"></gtrack-hike-details> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikePageComponent {
  hikeId$: Observable<string>;

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly store: Store<any>) {
    this.hikeId$ = this.store
      .select(routerSelectors.selectRouteParam, 'id')
      .pipe(
        filter(id => !!id),
        take(1)
      );
  }
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [CommonModule, HikeDetailsModule],
  declarations: [HikePageComponent],
  exports: [HikePageComponent],
})
export class HikePageModule {}
