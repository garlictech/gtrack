import * as fp from 'lodash/fp';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedLocalizationFeatureIonicModule } from '@gtrack/shared/localization/feature-ionic';
import { Store } from '@ngrx/store';
import { ExternalPoisActions } from '@admin/features/external-pois/store';
import { HikeEditorSelectors } from '@admin/features/hike-editor/store';
import { RoutePlannerSelectors } from '@admin/features/route-planner/store';
import { cloneDeep as _cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { HikePoiInfoModule } from '../hike-stop-info/hike-stop-info.component';
import { HikeStopTableModule } from '../hike-stop-table/hike-stop-table.component';
import { HikeStop } from '@bit/garlictech.universal.gtrack.hike-stops';
import { HikeStopSelectors } from '@bit/garlictech.angular.gtrack.hike-stops/store';
import {
  NbAccordionModule,
  NbButtonModule,
} from '@nebular/theme';

@Component({
  selector: 'gtrack-hike-stop-collector',
  templateUrl: './hike-stop-collector.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikeStopCollectorComponent {
  modalPoi: HikeStop;
  displayPoiModal: boolean;
  onRoutePois$: Observable<HikeStop[]>;
  offRoutePois$: Observable<HikeStop[]>;
  isPoiFound$: Observable<boolean>;
  noSegments$: Observable<boolean>;

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly store: Store<any>) {
    this.displayPoiModal = false;

    const hike$ = this.store.select(HikeEditorSelectors.getHike);

    this.offRoutePois$ = hike$.pipe(
      map(hike => hike.id),
      filter(fp.isString),
      switchMap(hikeId =>
        this.store.select(
          HikeStopSelectors.offrouteHikeStopsSortedByDistanceFromOrigo(hikeId)
        )
      )
    );

    this.onRoutePois$ = hike$.pipe(
      map(hike => hike.id),
      filter(fp.isString),
      switchMap(hikeId =>
        this.store.select(
          HikeStopSelectors.onrouteHikeStopsSortedByDistanceFromOrigo(hikeId)
        )
      )
    );

    this.isPoiFound$ = this.store.select(HikeStopSelectors.isPoiFound);
    this.noSegments$ = this.store.select(RoutePlannerSelectors.noSegments);
  }

  getExternalPois(): void {
    this.store
      .select(RoutePlannerSelectors.getSegments)
      .pipe(
        take(1),
        tap(segments =>
          this.store.dispatch(
            ExternalPoisActions.fetchExternalPois({ segments })
          )
        )
      )
      .subscribe();
  }

  getGtrackPois(): void {
    this.store
      .select(RoutePlannerSelectors.getRoute)
      .pipe(
        take(1),
        tap(() => this.store.dispatch(ExternalPoisActions.fetchGTrackPois()))
      )
      .subscribe();
  }

  // eslint:disable-next-line:no-property-initializers
  openPoiModal = (stop: HikeStop): void => {
    this.modalPoi = _cloneDeep(stop);
    this.displayPoiModal = true;
  };
}

@NgModule({
  imports: [
    HikeStopTableModule,
    SharedLocalizationFeatureIonicModule,
    HikePoiInfoModule,
    CommonModule,
    FormsModule,
    NbAccordionModule,
    NbButtonModule,
  ],
  exports: [HikeStopCollectorComponent],
  declarations: [HikeStopCollectorComponent],
})
export class HikeStopCollectorModule {}
