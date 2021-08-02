import { Injectable } from '@angular/core';
import { DescriptionLanguageListService } from '@gtrack/shared/localization/data-access';
import { combineLatest, from, Observable, of } from 'rxjs';
import { map, switchMap, take, toArray } from 'rxjs/operators';
import { LeafletMapMarker } from '../lib/leaflet-map-marker';

import { Store, MemoizedSelector } from '@ngrx/store';

import * as fp from 'lodash/fp';
import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';

import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { TranslateService } from '@ngx-translate/core';
import { HikeStop } from '@bit/garlictech.universal.gtrack.hike-stops';
import { HikeStopSelectors } from '@bit/garlictech.angular.gtrack.hike-stops/store';
import { ResolvedHikeData } from '@bit/garlictech.universal.gtrack.hike';

export interface HikeStopMarkers {
  onrouteMarkers: LeafletMapMarker[];
  offrouteMarkers: LeafletMapMarker[];
  checkpointMarkers: LeafletMapMarker[];
}

@Injectable({
  providedIn: 'root',
})
export class HikeStopMarkerService {
  constructor(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly translate: TranslateService,
    private readonly descriptionLanguageList: DescriptionLanguageListService // private readonly leafletMarkerPopupService: LeafletMarkerPopupService
  ) {}

  generateMapMarkers(stops: HikeStop[] = []): Observable<LeafletMapMarker[]> {
    return of(fp.map((stop: HikeStop) => stop.poi, stops)).pipe(
      switchMap((pois: Poi[]) => this.generatePoiMapMarkers(pois))
    );
  }

  generatePoiMapMarkers(pois: Poi[] = []): Observable<LeafletMapMarker[]> {
    // const createPopupData = () => ({
    //   popupComponentName: 'MarkerPopupComponent',
    //     markerClickCallback: this._leafletMarkerPopupService.onUserMarkerClick,
    //     closeCallback: () => {
    //       this.map.leafletMap.closePopup();
    //     },
    //     map: this.map.leafletMap,
    //     data: {
    //       poi: _cloneDeep(poi),
    //       stop: poiStop
    //     }
    // })
    return from(pois).pipe(
      switchMap(poi =>
        this.descriptionLanguageList
          .getLocalizedDescription(poi.description)
          .pipe(
            take(1),
            map(
              description =>
                new LeafletMapMarker(
                  poi.lat,
                  poi.lon,
                  description.title ?? '',
                  poi.types?.[0] ?? ''
                )
            )
          )
      ),
      toArray()
    );
  }

  generateCheckpointMapMarkers<POINT extends { lat: number; lon: number }>(
    points: POINT[]
  ): Observable<LeafletMapMarker[]> {
    return this.translate.get('common.hike.checkpoint').pipe(
      take(1),
      map(
        description =>
          fp.map(
            (point: POINT) =>
              new LeafletMapMarker(
                point.lat,
                point.lon,
                description,
                'generic:checkpoint'
              ),
            points
          ),
        fp.each<LeafletMapMarker>(marker => marker.addHighlight())
      )
    );
  }

  generateStartMarker(point: Point): LeafletMapMarker {
    return this.generateEndpointMarker(point, 'generic:start');
  }

  generateStopMarker(point: Point): LeafletMapMarker {
    return this.generateEndpointMarker(point, 'generic:finish');
  }

  generateRoundtripMarker(point: Point): LeafletMapMarker {
    return this.generateEndpointMarker(point, 'generic:start_finish');
  }

  getMarkersOfAHike$(hike: ResolvedHikeData): Observable<HikeStopMarkers> {
    const getMarkers = (
      selector: (id: string) => MemoizedSelector<any, HikeStop[]>
    ) =>
      this.store
        .select(selector(hike.hike.id))
        .pipe(switchMap((stops: HikeStop[]) => this.generateMapMarkers(stops)));

    const getCheckpoints = this.generateCheckpointMapMarkers(hike.checkpoints);

    return combineLatest([
      getMarkers(HikeStopSelectors.onrouteHikeStopsSortedByDistanceFromOrigo),
      getMarkers(HikeStopSelectors.offrouteHikeStopsSortedByDistanceFromOrigo),
      getCheckpoints,
    ]).pipe(
      map(([on, off, checkpointMarkers]) => ({
        onrouteMarkers: on,
        offrouteMarkers: off,
        checkpointMarkers,
      }))
    );
  }

  private generateEndpointMarker(point: Point, label: string) {
    const marker = new LeafletMapMarker(point.lat, point.lon, label, label);
    //marker.toggleHighlight();
    return marker;
  }
}
