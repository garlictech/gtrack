import { LeafletMapFp } from '@bit/garlictech.angular.gtrack.leaflet-map';
import { Position } from '@turf/helpers';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgModule,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeoPosition } from '@bit/garlictech.angular.gtrack.current-geolocation';
import {
  HikeStopMarkerService,
  HikeStopMarkers,
} from '@bit/garlictech.angular.gtrack.leaflet-map';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { WaypointMarkerService } from '@admin/features/waypoint-markers/services/waypoint-marker.service';
import * as commonBackgroundGeolocationActions from '@bit/garlictech.angular.gtrack.current-geolocation/store/actions';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap, filter } from 'rxjs/operators';
import * as fromActions from '../../store/actions';
import * as RoutePlannerActions from '../../store/actions';
import * as RoutePlannerSelectors from '../../store/selectors';
import { BufferDisplayButtonModule } from '../buffer-display-button.component';
import { RoutePlannerLib } from '../../lib/route-planner.lib';
import { LayerGroup, Map, LeafletMouseEvent } from 'leaflet';
import { GtrackMapComponentModule } from '@bit/garlictech.angular.gtrack.gtrack-map/gtrack-map.module';
import { Route } from '@bit/garlictech.universal.gtrack.route';
import * as HikeEditorSelectors from '@admin/features/hike-editor/store/selectors';
import * as fp from 'lodash/fp';
import { HikePlannerLocationSearchComponentModule } from './hike-planner-map-location-search.component';
import { ResolvedHikeData } from '@bit/garlictech.universal.gtrack.hike/lib/types';
import { NbButtonModule } from '@nebular/theme';

@Component({
  selector: 'gtrack-hike-planner-map',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikePlannerMapComponent implements OnDestroy {
  currentLocation$: Observable<GeoPosition | null>;
  locationSearchResult: google.maps.places.PlaceResult;
  featureOverlays$: Observable<LayerGroup[]>;
  stopMarkers$: Observable<HikeStopMarkers>;
  routes$: Observable<Route[]>;
  faSearch: IconDefinition = faSearch;

  private theMap: Map;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly waypointMarkerService: WaypointMarkerService,
    private changeDetector: ChangeDetectorRef,
    private readonly hikeStopMarkerService: HikeStopMarkerService
  ) {
    this.featureOverlays$ = RoutePlannerLib.getMapFeatures$(
      this.store,
      this.waypointMarkerService
    ).pipe(shareReplay(1));

    this.routes$ = RoutePlannerLib.routeFeature$(this.store);

    this.stopMarkers$ = this.store
      .select(HikeEditorSelectors.getResolvedHike)
      .pipe(
        filter(fp.isObject),
        switchMap(resolvedHike =>
          this.hikeStopMarkerService.getMarkersOfAHike$(
            resolvedHike as ResolvedHikeData
          )
        ),
        shareReplay(1)
      );
  }

  ngOnDestroy(): void {
    this.store.dispatch(
      new commonBackgroundGeolocationActions.EndPositioning()
    );
  }

  onMapClick(event$: LeafletMouseEvent): void {
    this.store.dispatch(
      fromActions.addWaypoint({
        wayPoint: LeafletMapFp.convertLeafletLatLngToPoint(event$.latlng),
      })
    );
  }

  onMapReady(event$: Map): void {
    this.theMap = event$;
  }

  goToLocation(position: Position): void {
    this.theMap.setView(
      LeafletMapFp.convertGeojsonPositionToLeafletLatlng(position),
      15
    );
    this.changeDetector.detectChanges();
  }

  removeLast(): void {
    this.store.dispatch(new RoutePlannerActions.PopSegment());
  }

  get canCloseCircle$(): Observable<boolean> {
    return this.store.select(RoutePlannerSelectors.canCloseCircle);
  }

  get hasRoute$(): Observable<boolean> {
    return this.store
      .select(RoutePlannerSelectors.getRoute)
      .pipe(map(route => !!route));
  }

  closeCircle(): void {
    this.store.dispatch(fromActions.closeCircle());
  }

  generateCheckpoints(): void {
    this.store.dispatch(fromActions.generateCheckpoints());
  }

  deletePlan(): void {
    /* EMPTY */
  }
}

@NgModule({
  imports: [
    FormsModule,
    FontAwesomeModule,
    CommonModule,
    BufferDisplayButtonModule,
    GtrackMapComponentModule,
    HikePlannerLocationSearchComponentModule,
    NbButtonModule,
  ],
  exports: [HikePlannerMapComponent],
  declarations: [HikePlannerMapComponent],
})
export class HikePlannerMapModule {}
