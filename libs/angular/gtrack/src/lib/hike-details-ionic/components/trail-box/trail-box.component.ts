import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  HikeStopMarkerService,
  HikeStopMarkers,
} from '@bit/garlictech.angular.gtrack.leaflet-map';
import { GtrackMapComponentModule } from '@bit/garlictech.angular.gtrack.gtrack-map/gtrack-map.module';
import { Route } from '@bit/garlictech.universal.gtrack.route';
import { Map, LayerGroup } from 'leaflet';
import { Observable } from 'rxjs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, map, switchMap, shareReplay } from 'rxjs/operators';
import * as fp from 'lodash/fp';
import { Position } from '@turf/helpers';
import { HikeStopsStoreModule } from '../../../hike-stops/store/hike-stops-store.module';
import {
  ResolvedHikeData,
  CalculatedHike,
} from '@bit/garlictech.universal.gtrack.hike';

@Component({
  selector: 'gtrack-trail-box',
  template: `
    <div class="map-container">
      <gtrack-map
        [routes$]="routes$"
        [stopMarkers$]="stopMarkers$"
        (map)="onTheMap($event)"
        [featureOverlays$]="extraFeatureOverlays$"
      ></gtrack-map>
    </div>
  `,
  styleUrls: ['./trail-box.component.scss'],
})
export class TrailBoxComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() resolvedHike$: Observable<ResolvedHikeData>;
  @Input() calculatedHike$: Observable<CalculatedHike>;
  @Input() elevationMarkerPosition: Position | null;
  @Input() elevationMarkerVisible: boolean | null;
  @Input() elevationMarkerLocked: boolean | null;
  @Input() extraFeatureOverlays$: Observable<LayerGroup[]>;

  @Output() readonly elevationLineOver: EventEmitter<void>;
  @Output() readonly elevationLineMove: EventEmitter<Position>;
  @Output() readonly elevationLineOut: EventEmitter<void>;
  @Output() readonly elevationLineClick: EventEmitter<{
    position: Position;
    forced?: boolean;
  }>;
  @Output() readonly elevationMarkerClick: EventEmitter<void>;
  @Output() readonly map: EventEmitter<Map> = new EventEmitter<Map>();

  offlineMap: boolean;
  routeOnTop = false;
  theMap: Map;
  routes$: Observable<Route[]>;
  stopMarkers$: Observable<HikeStopMarkers>;

  protected _elevationZoneHover: boolean;
  private _runningElevationPointMarker: L.Marker;

  constructor(private readonly hikeStopMarkerService: HikeStopMarkerService) {
    this.offlineMap = false;

    this.elevationLineOver = new EventEmitter<void>();
    this.elevationLineMove = new EventEmitter<Position>();
    this.elevationLineOut = new EventEmitter<void>();
    this.elevationMarkerClick = new EventEmitter<void>();
    this.elevationLineClick = new EventEmitter<{
      position: Position;
      forced?: boolean;
    }>();

    this.elevationMarkerPosition = [0, 0];
    this.elevationMarkerVisible = false;
    this.elevationMarkerLocked = false;
    this._elevationZoneHover = false;
  }

  ngOnInit(): void {
    this.routes$ = this.calculatedHike$.pipe(
      filter(hike => fp.isObject(hike)),
      map(hike => [hike.route]),
      shareReplay(1)
    );

    this.stopMarkers$ = this.resolvedHike$.pipe(
      filter(hike => fp.isObject(hike)),
      switchMap(hike => this.hikeStopMarkerService.getMarkersOfAHike$(hike)),
      shareReplay(1)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.elevationMarkerVisible !== 'undefined') {
      const markerVisible = changes.elevationMarkerVisible;
      this._showElavationPointMarker(markerVisible.currentValue);
    }

    if (typeof changes.elevationMarkerPosition !== 'undefined') {
      this._moveElavationPointMarker(
        changes.elevationMarkerPosition.currentValue
      );
    }
  }

  ngAfterViewInit(): void {
    // this._checkpointMarkerCollection = new CheckpointMarkerCollection(this.map.leafletMap, this._leafletIconService);
    // this.route$
    //   .pipe(
    //     filter((route: Route) => typeof route !== 'undefined'),
    //     takeUntil(this._destroy$)
    //   )
    //   .subscribe((route: Route) => {
    //     this.route = route;
    //     this.clearGeoJson();
    //     const feature: Feature<LineString> = { ...route.geojson.features[0] };
    //     feature.properties = {
    //       draw_type: `route_1`
    //     };
    //     this.addGeoJson(feature, this.map.leafletMap);
    //     setTimeout(() => {
    //       LeafletMapFp.fitBoundingBox(this.mapData, route.bounds);
    //     }, 100);
    //     const bounds = bbox(feature);
    //     const rectangle = transformScale(bboxPolygon(bounds), 1.3);
    //     this.map.leafletMap.on('mousemove', (e: L.LeafletMouseEvent) => {
    //       const point = turfPoint([e.latlng.lng, e.latlng.lat]);
    //       if (booleanPointInPolygon(point, rectangle)) {
    //         const line = turfLineString(feature.geometry.coordinates);
    //         const nearest = nearestPointOnLine(line, point);
    //         if (!this._elevationZoneHover) {
    //           this._elevationZoneHover = true;
    //           this.elevationLineOver.emit();
    //         }
    //         this.elevationLineMove.emit([nearest.geometry.coordinates[0], nearest.geometry.coordinates[1]]);
    //       } else {
    //         if (this._elevationZoneHover) {
    //           this.elevationLineOut.emit();
    //           this._elevationZoneHover = false;
    //         }
    //       }
    //     });
    //     this.map.leafletMap.on('click', (e: L.LeafletMouseEvent) => {
    //       const point = turfPoint([e.latlng.lng, e.latlng.lat]);
    //       if (booleanPointInPolygon(point, rectangle)) {
    //         const line = turfLineString(feature.geometry.coordinates);
    //         const nearest = nearestPointOnLine(line, point);
    //         this.elevationLineClick.emit({
    //           position: [nearest.geometry.coordinates[0], nearest.geometry.coordinates[1]]
    //         });
    //       }
    //     });
    //     this.map.leafletMap.on('gcmarkerclick', (e: L.LeafletMouseEvent) => {
    //       const point = turfPoint([e.latlng.lng, e.latlng.lat]);
    //       const line = turfLineString(feature.geometry.coordinates);
    //       const nearest = nearestPointOnLine(line, point);
    //       this.elevationLineClick.emit({
    //         position: [nearest.geometry.coordinates[0], nearest.geometry.coordinates[1]],
    //         forced: true
    //       });
    //     });
    //     this.map.leafletMap.on('mouseout', () => {
    //       if (this._elevationZoneHover) {
    //         this.elevationLineOut.emit();
    //         this._elevationZoneHover = false;
    //       }
    //     });
    //   });
    // this._checkpointMarkerCollection.removeCheckpointMarkers();
    // this._checkpointMarkerCollection.addCheckpointMarkers(this.hike.checkpoints.checkpoints);
    // this._runningElevationPointMarker = new L.Marker(
    //   [this.elevationMarkerPosition[1], this.elevationMarkerPosition[0]],
    //   {
    //     opacity: 0,
    //     zIndexOffset: 1000,
    //     icon: new L.Icon({
    //       // eslint:disable:no-require-imports
    //       iconUrl: require('leaflet/dist/images/marker-icon.png'),
    //       iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    //       shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    //       / :enable:no-require-imports
    //       iconSize: [25, 41],
    //       shadowSize: [41, 41],
    //       iconAnchor: [12, 41],
    //       popupAnchor: [1, -34],
    //       tooltipAnchor: [16, -28]
    //     })
    //   }
    // );
    // this._runningElevationPointMarker.addTo(this.map.leafletMap).on('click', () => this.elevationMarkerClick.emit());
    // this._showElavationPointMarker(this.elevationMarkerVisible);
  }

  onTheMap(event$: Map): void {
    this.theMap = event$;
    this.map.emit(this.theMap);
  }

  protected _showElavationPointMarker(show = true): void {
    const opacity = show ? 1 : 0;

    if (this._runningElevationPointMarker) {
      this._runningElevationPointMarker.setOpacity(opacity);
    }
  }

  protected _moveElavationPointMarker(position: Position): void {
    if (this._runningElevationPointMarker) {
      this._runningElevationPointMarker.setLatLng([position[1], position[0]]);
    }
  }
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [HikeStopsStoreModule, GtrackMapComponentModule, CommonModule],
  exports: [TrailBoxComponent],
  declarations: [TrailBoxComponent],
  providers: [],
})
export class TrailBoxComponentModule {}
