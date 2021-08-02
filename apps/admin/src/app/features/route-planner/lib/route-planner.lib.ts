import { Observable, combineLatest } from 'rxjs';
import { LayerGroup } from 'leaflet';
import { Store } from '@ngrx/store';
import { RoutePlannerSelectors } from '../store';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import * as fp from 'lodash/fp';
import {
  LeafletMapFp,
  GEOJSON_STYLES,
} from '@bit/garlictech.angular.gtrack.leaflet-map';
import { Route } from '@bit/garlictech.universal.gtrack.route';
import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';
import { WaypointMarkerService } from '@admin/features/waypoint-markers/services/waypoint-marker.service';
import { EBuffer } from '@bit/garlictech.universal.gtrack.route-segment';

const upgradeBufferOnMapCalc$ = (whichBuffer: EBuffer, store: Store) => {
  return combineLatest([
    store.select(RoutePlannerSelectors.getRoute),
    store.select(RoutePlannerSelectors.isRouteBufferShown, whichBuffer),
  ]).pipe(
    distinctUntilChanged(fp.isEqual),
    filter(([route]) => !!route),
    map(([route, isShown]) => {
      const style =
        whichBuffer === EBuffer.SMALL
          ? GEOJSON_STYLES.smallBuffer
          : GEOJSON_STYLES.bigBuffer;
      const buffer =
        whichBuffer === EBuffer.BIG ? route.bigBuffer : route.smallBuffer;
      return isShown
        ? LeafletMapFp.createFeatureGroupFromGeoJSONObject(buffer, [style])
        : undefined;
    }),
    // eslint:disable-next-line:deprecation
    startWith(undefined)
  );
};

const waypointMarkerFeatures$ = (
  store: Store,
  waypointMarkerService: WaypointMarkerService
) =>
  combineLatest([
    store.select(RoutePlannerSelectors.getRoute),
    store.select(RoutePlannerSelectors.getRouteStartPoint),
  ]).pipe(
    distinctUntilChanged(fp.isEqual),
    map(([route, startPoint]: [Route, Point]) => {
      const waypoints = fp.get('waypoints', route) || [];
      return fp.isEmpty(waypoints)
        ? startPoint
          ? [startPoint]
          : []
        : waypoints;
    }),
    map((points: Point[]) =>
      waypointMarkerService.createMarkerLayerGroup(points)
    ),
    // eslint:disable-next-line:deprecation
    startWith(undefined)
  );

export class RoutePlannerLib {
  static getMapFeatures$(
    store: Store,
    waypointMarkerService: WaypointMarkerService
  ): Observable<LayerGroup[]> {
    return combineLatest([
      waypointMarkerFeatures$(store, waypointMarkerService),
      upgradeBufferOnMapCalc$(EBuffer.BIG, store),
      upgradeBufferOnMapCalc$(EBuffer.SMALL, store),
    ]).pipe(map(fp.filter<LayerGroup>(fp.isObject)));
  }

  static routeFeature$(store: Store): Observable<Route[]> {
    return store.select(RoutePlannerSelectors.getRoute).pipe(
      distinctUntilChanged(fp.isEqual),
      map(route => [route]),
      // eslint:disable-next-line:deprecation
      startWith(undefined)
    );
  }
}
