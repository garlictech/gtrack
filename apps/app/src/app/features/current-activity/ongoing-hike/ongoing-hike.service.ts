import { Injectable } from '@angular/core';
import {
  Observable,
  from,
  interval,
  zip,
  of,
  combineLatest,
  Subscription,
} from 'rxjs';
import {
  CalculatedHike,
  ResolvedHikeData,
} from '@bit/garlictech.universal.gtrack.hike';
import {
  filter,
  map,
  shareReplay,
  switchMap,
  withLatestFrom,
  tap,
  startWith,
} from 'rxjs/operators';
import * as fp from 'lodash/fp';
import { LayerGroup } from 'leaflet';
import {
  CurrentGeolocationActions,
  EGeolocationType,
} from '@bit/garlictech.angular.gtrack.current-geolocation';
import { Store } from '@ngrx/store';
import { Route } from '@bit/garlictech.universal.gtrack.route';
import {
  LeafletMapFp,
  GEOJSON_STYLES,
} from '@bit/garlictech.angular.gtrack.leaflet-map';
import * as CurrentActivitySelectors from '../store/selectors';
import * as CurrentActivityActions from '../store/actions';
import { Track } from '@bit/garlictech.angular.gtrack.track/lib/track';
import { CurrentActivityFp } from '../lib/current-activity.fp';
import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { TimelineItem } from '@bit/garlictech.universal.gtrack.timeline';

@Injectable()
export class OngoingHikeService {
  isSimulationMode = false;
  private simulationSubs: Subscription;

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly store: Store<any>) {}

  init(
    resolvedHike$: Observable<ResolvedHikeData>,
    recordedTrack$: Observable<Track>
  ): Observable<LayerGroup[]> {
    const hike$: Observable<CalculatedHike> =
      resolvedHike$ &&
      resolvedHike$.pipe(
        filter(resolvedHike => fp.isObject(resolvedHike)),
        map(resolvedHike => resolvedHike.hike),
        shareReplay(1)
      );

    const extraFeatureOverlays$: Observable<LayerGroup[]> = recordedTrack$.pipe(
      switchMap(track =>
        fp.isObject(track) && fp.isObject(track.route)
          ? of(track.route).pipe(
              map((route: Route) => [
                LeafletMapFp.createFeatureGroupFromGeoJSONObject(
                  route.track,
                  GEOJSON_STYLES.trackMultiline
                ),
                LeafletMapFp.createFeatureGroupFromGeoJSONObject(
                  route.smallBuffer,
                  [GEOJSON_STYLES.smallBuffer]
                ),
              ])
            )
          : of(undefined)
      ),
      // eslint:disable-next-line:deprecation
      startWith(undefined)
    );

    if (this.isSimulationMode) {
      this._createMockMovement(hike$);
    }

    return extraFeatureOverlays$;
  }

  getOnroutePoisPassed$(
    resolvedHike$: Observable<ResolvedHikeData>,
    recordedTrack$: Observable<Track>
  ): Observable<{ poisPassed: Poi[]; nextPoiToPass: Poi }> {
    return combineLatest([
      resolvedHike$,
      recordedTrack$,
      this.store.select(CurrentActivitySelectors.isMoving),
    ]).pipe(
      filter(
        ([resolvedHike, track, isMoving]) =>
          isMoving &&
          fp.isObject(resolvedHike) &&
          fp.isObject(track) &&
          fp.isObject(resolvedHike.timeline)
      ),
      map(([resolvedHike, track]: [ResolvedHikeData, Track, boolean]) =>
        fp.flow(
          () => resolvedHike.timeline,
          fp.map((timelineItem: TimelineItem) => timelineItem.stop.poi),
          pois => [CurrentActivityFp.PassedPois(pois, track.route), pois],
          ([passedPois, allPois]) => [
            passedPois,
            fp.flow(
              () =>
                fp.differenceWith(
                  (poi1, poi2) => poi1.id === poi2.id,
                  allPois,
                  passedPois
                ),
              fp.first
            )(),
          ]
        )()
      ),
      filter(fp.each(fp.isArray)),
      filter(fp.each(fp.negate(fp.isEmpty))),
      map(([poisPassed, nextPoiToPass]: [Poi[], Poi]) => ({
        poisPassed,
        nextPoiToPass,
      })),
      tap(({ poisPassed, nextPoiToPass }) => {
        this.store.dispatch(
          CurrentActivityActions.updatePassedPois({ pois: poisPassed })
        );
        this.store.dispatch(
          CurrentActivityActions.setNextPoiToPass({ poi: nextPoiToPass })
        );
      })
    );
  }

  private _createMockMovement(hike$: Observable<CalculatedHike>) {
    this.store.dispatch(new CurrentGeolocationActions.EndPositioning());

    const route$ = hike$.pipe(
      filter(hike => fp.isObject(hike)),
      map(hike => hike.route),
      tap(route =>
        this.store.dispatch(
          new CurrentGeolocationActions.CurrentLocationObtained({
            coords: {
              longitude: route.track.geometry.coordinates[0][0],
              latitude: route.track.geometry.coordinates[0][1],
              altitude: route.track.geometry.coordinates[0][2],
              heading: 0,
              speed: 0,
              altitudeAccuracy: 0,
            },
            timestamp: Date.now(),
            type: EGeolocationType.BROWSER,
          })
        )
      )
    );

    const coordinateStream$ = route$.pipe(
      switchMap(route => from(route.track.geometry.coordinates))
    );

    const notificationStream$ = interval(1000).pipe(
      withLatestFrom(this.store.select(CurrentActivitySelectors.isMoving)),
      filter(([, isMoving]) => isMoving)
    );

    this.simulationSubs = zip(coordinateStream$, notificationStream$)
      .pipe(
        map(([val]) => val),
        tap(coords =>
          this.store.dispatch(
            new CurrentGeolocationActions.CurrentLocationObtained({
              coords: {
                longitude: coords[0],
                latitude: coords[1],
                altitude: coords[2],
                heading: 0,
                speed: 0,
                altitudeAccuracy: 0,
              },
              timestamp: Date.now(),
              type: EGeolocationType.BROWSER,
            })
          )
        )
      )
      .subscribe();
  }

  activityCleared(resolvedHike$: Observable<ResolvedHikeData>): void {
    if (this.simulationSubs) {
      this.simulationSubs.unsubscribe();
    }

    const hike$: Observable<CalculatedHike> =
      resolvedHike$ &&
      resolvedHike$.pipe(
        filter(resolvedHike => fp.isObject(resolvedHike)),
        map(resolvedHike => resolvedHike.hike),
        shareReplay(1)
      );

    this._createMockMovement(hike$);
  }

  // getNextPoi$() {}

  // getOffroutePoisPassed$ () {}
  // getPoisToGo$ () {}
}
