import { Injectable } from '@angular/core';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { HikeStopsService } from '@bit/garlictech.angular.gtrack.hike-stops';
import { LocalizationSelectors } from '@gtrack/shared/localization/data-access';
import { Store } from '@ngrx/store';
import { BaseBuilder, buildGPX } from 'gpx-builder';
import { combineLatest, from, Observable } from 'rxjs';
import {
  map,
  switchMap,
  toArray,
  withLatestFrom,
  tap,
  mapTo,
} from 'rxjs/operators';
import { HikeStop } from '@bit/garlictech.universal.gtrack.hike-stops';
import { MultiLanguageTextFp } from '@gtrack/shared/localization/utils';

const Waypoint = BaseBuilder.MODELS.Point;
const Metadata = BaseBuilder.MODELS.Metadata;

@Injectable({ providedIn: 'root' })
export class GpxService {
  segmentPoints: any[];
  constructor(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly hikeStops: HikeStopsService
  ) { }

  convertHikeToGpx(
    hike: CalculatedHike,
    onrouteStops: HikeStop[]
  ): Observable<string> {
    return this.store.select(LocalizationSelectors.currentLanguage).pipe(
      switchMap(currentLanguage =>
        from(onrouteStops).pipe(
          map(
            stop =>
              new Waypoint(stop.poi.lat, stop.poi.lon, {
                name: MultiLanguageTextFp.selectTextByLanguage(currentLanguage)(
                  stop.poi.description
                ).title!,
                ele: stop.poi.elevation,
              })
          ),
          toArray(),
          map(waypoints => {
            if(hike.route.track.geometry !== null ) {
              this.segmentPoints = hike.route.track.geometry.coordinates.map(
                coordinate =>
                  new Waypoint(coordinate[1], coordinate[0], {
                    ele: coordinate[2],
                  })
              ) ;
            }
        
            const gpxData = new BaseBuilder();
            gpxData.setSegmentPoints(this.segmentPoints);
            gpxData.setWayPoints(waypoints);
       /*      gpxData.setMetadata(
              new Metadata({
                CollectionServiceBasename: 
                MultiLanguageTextFp.selectTextByLanguage(currentLanguage)(
                  hike.data.description 
                )?.title,
              }) 
            ); */
            return buildGPX(gpxData.toObject());
          })
        )
      )
    );
  }

  downloadHike$(hike$: Observable<CalculatedHike>): Observable<boolean> {
    const hikeId$ = hike$.pipe(map(hike => hike.data.id));

    const onrouteStops$ = hikeId$.pipe(
      switchMap(hikeId => this.hikeStops.onrouteStops$(hikeId))
    );

    return combineLatest([hike$, onrouteStops$]).pipe(
      switchMap(([hike, onrouteStops]: [CalculatedHike, HikeStop[]]) =>
        this.convertHikeToGpx(hike, onrouteStops)
      ),
      withLatestFrom(hikeId$),
      tap(([xml, hikeId]) => {
        const blob = new Blob([xml], { type: 'application/gpx+xml' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const url = reader?.result?.toString();
          const element = document.createElement('a');
          element.setAttribute('href', url as string);
          element.setAttribute('rel', 'noopener');
          element.setAttribute('target', '_self');
          element.setAttribute('download', `${hikeId}.gpx`);
          element.click();
          URL.revokeObjectURL(url as string);
        };
        reader.readAsDataURL(blob);
      }),
      mapTo(true)
    );
  }
}
