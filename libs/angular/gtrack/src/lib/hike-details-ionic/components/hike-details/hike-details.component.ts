import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Image } from '@bit/garlictech.universal.gtrack.graphql-api';
import {
  HikeService,
  HikeDetailsResolverService,
} from '@bit/garlictech.angular.gtrack.hike-details';
import {
  HikeStopsService,
  OnOffrouteStopsDetails,
} from '@bit/garlictech.angular.gtrack.hike-stops';

import { WeatherEntity } from '@bit/garlictech.angular.gtrack.weather/store';
import { Platform } from '@ionic/angular';

import * as fp from 'lodash/fp';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { handler } from 'rx-handler';
import { Observable, from } from 'rxjs';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { GpxService } from '@bit/garlictech.angular.gtrack.gpx';
import {
  CalculatedHike,
  ResolvedHikeData,
} from '@bit/garlictech.universal.gtrack.hike';
import { Timeline } from '@bit/garlictech.universal.gtrack.timeline';

@UntilDestroy()
@Component({
  selector: 'gtrack-hike-details',
  templateUrl: './hike-details.component.html',
  styleUrls: ['./hike-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikeDetailsComponent implements OnInit {
  @Input() hikeId$: Observable<string>;

  hike$: Observable<ResolvedHikeData>;
  calculatedHike$: Observable<CalculatedHike>;
  imageUrls$: Observable<string[]>;
  onOffrouteStopsDetails$: Observable<OnOffrouteStopsDetails>;
  forecast$: Observable<WeatherEntity>;
  startDate$: Observable<Date>;
  speed$: Observable<number>;
  timeline$: Observable<Timeline>;

  onDownloadGpx = handler();

  constructor(
    public readonly platform: Platform,
    private readonly hikeStops: HikeStopsService,
    private readonly gpxService: GpxService,
    private readonly hikeService: HikeService,
    private readonly hikeResolver: HikeDetailsResolverService
  ) {}

  ngOnInit(): void {
    this.calculatedHike$ = this.hikeId$.pipe(
      filter(id => !fp.isEmpty(id)),
      switchMap(id => this.hikeService.getByKey(id)),
      filter(hike => fp.isObject(hike)),
      shareReplay(1)
    );

    this.hike$ = this.calculatedHike$.pipe(
      switchMap(calcHike => this.hikeResolver.resolveHike(calcHike)),
      filter((hikeData: ResolvedHikeData) => fp.isObject(hikeData)),
      shareReplay(1)
    );

    this.timeline$ = this.hike$.pipe(
      filter(
        (hikeData: ResolvedHikeData) =>
          fp.isObject(hikeData) && fp.isObject(hikeData.timeline)
      ),
      map(hikeData => hikeData.timeline),
      shareReplay(1)
    );

    this.imageUrls$ = this.hike$.pipe(
      filter(hikeData => fp.isObject(hikeData) && fp.isArray(hikeData.images)),
      map(
        fp.flow(
          hikeData => hikeData.images,
          fp.map((image: Image) => image.thumbnail.url),
          fp.shuffle
        )
      ),
      shareReplay(1)
    );

    this.onOffrouteStopsDetails$ = this.hike$.pipe(
      switchMap((hike: ResolvedHikeData) =>
        this.hikeStops.getDetailsOfOnOffRouteStops$(hike.hike.id)
      ),
      shareReplay(1)
    );

    from(this.onDownloadGpx)
      .pipe(
        untilDestroyed(this),
        switchMap(() =>
          this.gpxService.downloadHike$(this.calculatedHike$).pipe(take(1))
        )
      )
      .subscribe();

    // const start = this.hike.stops[0];
    // this.startDate$ = this._store.select(selectStartDateHikeSettingsOf, { id: this.hike.id });
    // this.speed$ = this._store.select(selectSpeedHikeSettingsOf, { id: this.hike.id });

    // if (start) {
    //   this._position = [start.lon, start.lat];
    //   this.forecast$ = this._store.pipe(
    //     select(this._weatherSelectors.getWeatherContext(this._position)),
    //     tap(context => {
    //       if (!context || (!context.loading && !context.loaded)) {
    //         this._store.dispatch(new actions.GetForecast(this._position));
    //       }
    //     }),
    //     map(context => context && context.loaded),
    //     filter(loaded => loaded),
    //     switchMap(() => this._store.pipe(select(this._weatherSelectors.getWeather(this._position))))
    //   );
    // }
  }

  startHike(): void {
    // this._router.navigate([`/hike/${this.hike.id}/go`]);
  }
}
