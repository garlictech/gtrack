import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { Route } from '@bit/garlictech.universal.gtrack.route';
import { RouteSegment } from '@bit/garlictech.universal.gtrack.route-segment';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils';
import { Store } from '@ngrx/store';
import * as fp from 'lodash/fp';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import * as RoutePlannerSelectors from '../../store/selectors';
import * as O from 'fp-ts/lib/Option';

@Component({
  selector: 'gtrack-app-hike-route-planner',
  templateUrl: './ui.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikeRoutePlannerComponent {
  segments$: Observable<RouteSegment[]>;
  route$: Observable<Route>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly store: Store<any>) {
    this.segments$ = this.store
      .select(RoutePlannerSelectors.getSegments)
      .pipe(distinctUntilChanged(fp.isEqual));

    this.route$ = this.store.select(RoutePlannerSelectors.getRoute).pipe(
      filter(O.isSome),
      map(routeOpt => routeOpt.value)
    );
  }
}

// eslint:disable-next-line: max-classes-per-file
@NgModule({
  imports: [CommonModule, UtilsModule],
  exports: [HikeRoutePlannerComponent],
  declarations: [HikeRoutePlannerComponent],
})
export class HikeRoutePlannerModule {}
