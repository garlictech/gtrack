import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable, of, combineLatest, from, pipe } from 'rxjs';
import {
  LeafletMapFp,
  GEOJSON_STYLES,
  LeafletMapComponent,
  HikeStopMarkerService,
  HikeStopMarkers,
  LeafletMapMarker,
} from '@bit/garlictech.angular.gtrack.leaflet-map';
import { LayerGroup, Map, LeafletMouseEvent } from 'leaflet';
import { Route } from '@bit/garlictech.universal.gtrack.route';
import * as fp from 'lodash/fp';
import { map, shareReplay, filter, tap, startWith, take } from 'rxjs/operators';
import { boundingBoxOfPaths } from '@bit/garlictech.universal.gtrack.geometry';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { handler } from 'rx-handler';
import { Circle } from '@bit/garlictech.universal.gtrack.geometry';
import { BoundingBox } from '@bit/garlictech.universal.gtrack.graphql-api';

@UntilDestroy()
@Component({
  selector: 'gtrack-map',
  templateUrl: './gtrack-map.component.html',
  styleUrls: ['./gtrack-map.scss'],
})
export class GtrackMapComponent implements OnInit, AfterViewInit {
  @Input() routes$: Observable<Route[]>;
  @Input() stopMarkers$: Observable<HikeStopMarkers>;
  @Input() fitBounds: BoundingBox;
  @Input() showSpinner! : boolean;
  @Input() searchCircle$?: Observable<Circle>;
  @Input() featureOverlays$: Observable<LayerGroup[]>;

  @Output() readonly map: EventEmitter<Map> = new EventEmitter<Map>();
  @Output() readonly mapClick = new EventEmitter<any>();

  @ViewChild(LeafletMapComponent) leafletMap: {
    setBounds: (arg0: BoundingBox) => void;
  };

  allFeatureOverlays$: Observable<LayerGroup[]>;
  theMap: Map;
  onPoiConfigChange = handler();
  poiControlShown$: Observable<boolean>;
  routeOnTop$!: Observable<boolean>;
  stopMapMarkers$: Observable<LeafletMapMarker[]>;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private readonly hikeStopMarkerService: HikeStopMarkerService
  ) {}

  ngOnInit(): void {
    const isRouteValid = pipe(
      filter(fp.isArray),
      filter(fp.every(fp.isObject))
    );

    const routeOverlays$ = (this.routes$ || of(undefined)).pipe(
        isRouteValid,
      map(
        fp.map((route: Route) =>
          LeafletMapFp.createFeatureGroupFromGeoJSONObject(
            route.track,
            GEOJSON_STYLES.trackShadowed
          )
        )
      ),
      // eslint:disable-next-line:deprecation
      startWith(undefined)
    );

    const routeEndpointMapMarkers$ = this.routes$.pipe(
      isRouteValid,
      map(
        fp.flow(
          fp.map((route: Route) =>
            route.isRoundTrip
              ? [
                  this.hikeStopMarkerService.generateRoundtripMarker(
                    route.startPoint
                  ),
                ]
              : [
                  this.hikeStopMarkerService.generateStartMarker(
                    route.startPoint
                  ),
                  this.hikeStopMarkerService.generateStopMarker(route.endPoint),
                ]
          ),
          fp.flatten
        )
      ),
      // eslint:disable-next-line:deprecation
      startWith([])
    );

    this.stopMapMarkers$ = combineLatest([
      from(this.onPoiConfigChange),
      this.stopMarkers$ ||
        of({
          onrouteMarkers: [],
          offRouteMarkers: [],
          checkpoints: [],
        }),
      routeEndpointMapMarkers$,
    ]).pipe(
      map(
        ([
          { onrouteShown, offrouteShown, checkpointsShown },
          { onrouteMarkers, offrouteMarkers, checkpointMarkers },
          routeEndpointMarkers,
        ]: [
          {
            onrouteShown: boolean;
            offrouteShown: boolean;
            checkpointsShown: boolean;
          },
          HikeStopMarkers,
          LeafletMapMarker[]
        ]) =>
          fp.flow(
            () => (onrouteShown ? onrouteMarkers : []),
            fp.concat(offrouteShown ? offrouteMarkers : []),
            fp.concat(checkpointsShown ? checkpointMarkers : []),
            fp.concat(routeEndpointMarkers)
          )()
      ),
      startWith([])
    );

    const circleLayer$ = !this.searchCircle$
      ? of(undefined)
      : this.searchCircle$.pipe(
/*           filter(fp.isObject),
 */          map((circle: Circle) =>
            LeafletMapFp.createCircleLayer(circle, '#456778')
          ),
          // eslint:disable-next-line:deprecation
          startWith(undefined)
        );

    this.allFeatureOverlays$ = combineLatest([
      routeOverlays$,
      circleLayer$,
      this.featureOverlays$ || of(undefined),
    ]).pipe(
      map(fp.flatten),
      map(fp.filter<LayerGroup>(fp.isObject)),
      shareReplay(1)
    );

    this.routeOnTop$ = from(this.onPoiConfigChange).pipe(
      startWith(false),
      map(({ routeOnTop }) => {
        return routeOnTop;
      })
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.resetMap(), 1);

    this.poiControlShown$ = this.stopMarkers$
      ? this.stopMarkers$.pipe(
          map(
            markers =>
              markers &&
              !(
                fp.isEmpty(markers.offrouteMarkers) &&
                fp.isEmpty(markers.onrouteMarkers)
              )
          ),
          shareReplay()
        )
      : of(false);
  }

  onTheMap(event$: Map): void {
    this.theMap = event$;
    this.map.emit(this.theMap);
    this.changeDetector.detectChanges();
  }

  onMapClick(event$: LeafletMouseEvent): void {
    this.mapClick.emit(event$);
  }

  resetMap(): void {
    this.fitBounds
      ? of(this.fitBounds)
      : this.routes$
          .pipe(
            filter(fp.isArray),
            filter(fp.every(fp.isObject)),
            tap(
              fp.flow(
                fp.map((route: Route) => route.track.geometry),
                boundingBoxOfPaths,
                bounds => {
                  this.theMap?.invalidateSize();
                  this.leafletMap.setBounds(bounds);
                }
              )
            ),
            take(1),
            untilDestroyed(this)
          )
          .subscribe();
  }
}
