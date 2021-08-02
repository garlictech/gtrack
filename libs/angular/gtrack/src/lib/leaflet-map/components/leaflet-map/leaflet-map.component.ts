import { AngularResizedEventModule } from 'angular-resize-event';
import '@runette/leaflet-fullscreen';
import 'leaflet.locatecontrol';
import 'leaflet-pixi-overlay';
import * as fp from 'lodash/fp';
import { NgModule, ChangeDetectorRef } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  DEFAULT_LAYERS,
  DEFAULT_LEAFLET_MAP_CONFIG,
  DEFAULT_ZOOM,
  DEFAULT_BASE_LAYERS,
  DEFAULT_OVERLAYS,
  WAYMARKED_TRAILS_PANE_NAME,
  DEFAULT_CENTER,
} from '../../constants';
import { Center, LayerDef, LeafletMapConfig } from '../../interfaces';
import {
  Map,
  LatLngBoundsExpression,
  LeafletMouseEvent,
  Marker,
  LayerGroup,
} from 'leaflet';
import { BoundingBox } from '@bit/garlictech.universal.gtrack.graphql-api';
import { LeafletMapFp, decorateMap } from '../../lib/leaflet-map.fp';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SpinnerModule } from '@bit/garlictech.angular.gtrack.spinner';
import { CommonModule } from '@angular/common';
import { NgxLeafletFullscreenModule } from '@runette/ngx-leaflet-fullscreen';
import {
  GeoLocationService,
  CurrentGeolocationStoreModule,
} from '@bit/garlictech.angular.gtrack.current-geolocation';
import * as L from 'leaflet';
import { LeafletMapMarker } from '../../lib';
import { PoiIconComponentModule } from '@bit/garlictech.angular.gtrack.poi-icons';
import {
  loadMarkers,
  createPixiOverlay,
  PixiOverlayDef,
  setState,
} from '../../lib/pixi-overlay';
import { GestureHandling } from 'leaflet-gesture-handling';
import { tap, filter, switchMap } from 'rxjs/operators';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import * as O from 'fp-ts/lib/Option';

L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);

@UntilDestroy()
@Component({
  selector: 'gtrack-leaflet-map',
  templateUrl: './leaflet-map.component.html',
})
export class LeafletMapComponent implements OnInit {
  @Input() center: Center;
  @Input() layers: LayerDef[];
  @Input() overlays: LayerDef[];
  @Input() activeOverlays: string[];
  @Input() config: LeafletMapConfig;
  @Input() rounded: boolean;
  @Input() showSpinner: boolean | null;
  @Input() featureOverlays?: LayerGroup<any>[] | null;

  @Input() markers$: Observable<LeafletMapMarker[]>;

  @Input() set fitBounds(bounds: BoundingBox) {
    this.setBounds(bounds);
  }

  @Input() set routeOnTop(isOnTop: boolean | null) {
    if (this.mapInstance !== undefined) {
      this.mapInstance.getPane(
        WAYMARKED_TRAILS_PANE_NAME
      )!.style.zIndex = isOnTop !== undefined ? '300' : '500';
    }
  }

  // Optional leaflet event emitters
  @Output() readonly mapClick: EventEmitter<L.LeafletMouseEvent>;
  @Output() readonly mapMouseDown: EventEmitter<L.LeafletMouseEvent>;
  @Output() readonly mapMouseUp: EventEmitter<L.LeafletMouseEvent>;
  @Output() readonly mapMouseOut: EventEmitter<L.LeafletMouseEvent>;
  @Output() readonly mapMouseMove: EventEmitter<L.LeafletMouseEvent>;
  @Output() readonly mapZoomEnd: EventEmitter<L.ZoomAnimEvent>;
  @Output() readonly theMap: EventEmitter<Map>;

  bounds: LatLngBoundsExpression;
  options: any;
  layersControl: any;
  mapInstance: Map | undefined;
  individualMarkerStore: Marker[] = [];

  public locateOptions = {
    flyTo: false,
    watch: true,
    keepCurrentZoomLevel: true,
    // locateOptions: {
    //   enableHighAccuracy: true,
    // },

    icon: 'fas fa-crosshairs',
    clickBehavior: {
      inView: 'stop',
      outOfView: 'setView',
      inViewNotFollowing: 'setView',
    },
  };

  fullscreenOptions = {
    position: 'topleft',
    pseudoFullscreen: false,
    title: { true: 'Exit Fullscreen', false: 'View Fullscreen' },
  };

  private pixiOverlay: PixiOverlayDef;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly geolocationService: GeoLocationService
  ) {
    this.activeOverlays = [];
    this.config = DEFAULT_LEAFLET_MAP_CONFIG;
    this.rounded = false;
    this.mapClick = new EventEmitter<L.LeafletMouseEvent>();
    this.mapMouseDown = new EventEmitter<L.LeafletMouseEvent>();
    this.mapMouseUp = new EventEmitter<L.LeafletMouseEvent>();
    this.mapMouseOut = new EventEmitter<L.LeafletMouseEvent>();
    this.mapMouseMove = new EventEmitter<L.LeafletMouseEvent>();
    this.mapZoomEnd = new EventEmitter<L.ZoomAnimEvent>();
    this.theMap = new EventEmitter<Map>();
  }

  ngOnInit(): void {
    this.options = {
      layers: DEFAULT_LAYERS,
      zoom: DEFAULT_ZOOM,
      center: DEFAULT_CENTER,
      //gestureHandling: true,
    };

    this.layersControl = fp.cloneDeep({
      baseLayers: DEFAULT_BASE_LAYERS,
      overlays: DEFAULT_OVERLAYS,
    });

    this.markers$
      .pipe(
        untilDestroyed(this),
        filter(() => !!this.mapInstance),
        switchMap(markers =>
          loadMarkers(markers).pipe(
            tap(resources => {
              setState({ resources, markers });
              (this.pixiOverlay.layer as any).redraw();
            })
          )
        )
      )
      .subscribe();
  }

  onLeafletClick($event: LeafletMouseEvent): void {
    this.mapClick.emit($event);
  }

  onMapReady(theMap: Map): void {
    if (theMap) {
      this.mapInstance = theMap || undefined;
      theMap.createPane(WAYMARKED_TRAILS_PANE_NAME);
      theMap.getPane(WAYMARKED_TRAILS_PANE_NAME)!.style!.zIndex = '300';
      this.pixiOverlay = createPixiOverlay();
      this.pixiOverlay.layer.addTo(this.mapInstance);
      decorateMap(this.geolocationService)(theMap);
      this.theMap.emit(theMap);
    }
  }

  // see: https://github.com/Asymmetrik/ngx-leaflet/issues/104#issuecomment-515341388
  onResized(): void {
    if (this.mapInstance) {
      this.mapInstance.invalidateSize();
    }
  }

  setBounds(bounds: BoundingBox): void {
    if (bounds) {
      this.bounds = LeafletMapFp.getBounds(bounds);
      this.changeDetectorRef.detectChanges();
    }
  }
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
    // NgxLeafletLocateModule,
    AngularResizedEventModule,
    SpinnerModule,
    LeafletModule,
    CommonModule,
    CurrentGeolocationStoreModule,
    NgxLeafletFullscreenModule,
    PoiIconComponentModule,
  ],
  exports: [LeafletMapComponent],
  declarations: [LeafletMapComponent],
})
export class LeafletMapComponentModule { }
