import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  NgModule,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { DifficultyFp } from '@bit/garlictech.universal.gtrack.difficulty';
import { PoiIconRowLabelledComponentModule } from '@bit/garlictech.angular.gtrack.poi-icons';
import { SharedLocalizationFeatureIonicModule } from '@gtrack/shared/localization/feature-ionic';
import { SharedLocalizationUiAngularModule } from '@gtrack/shared/localization/ui-angular';
import { Go } from '@bit/garlictech.angular.gtrack.router/store';
import { } from '@bit/garlictech.angular.gtrack.timeline';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils';
import { WeatherEntity } from '@bit/garlictech.angular.gtrack.weather/store';
import { DataBadgeComponentModule } from '@bit/garlictech.angular.gtrack.data-visualization-ionic';
import { DifficultyComponentModule } from '@bit/garlictech.angular.gtrack.difficulty-ionic';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import * as fp from 'lodash/fp';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimelineVerticalLineComponent } from './timeline-vertical-line.component';
import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { HikeStop } from '@bit/garlictech.universal.gtrack.hike-stops';
import {
  Timeline,
  TimelineItem,
} from '@bit/garlictech.universal.gtrack.timeline';
import { HikeStopTypesModule } from '../../../hike-stops';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IonicModule } from '@ionic/angular';
import { SettingsSharedGenericUiDataAccessModule } from '../../../customer/settings-pipes.module';
import { SharedGenericUiFeatureIonicModule } from '@gtrack/shared/generic-ui/feature-ionic';

@UntilDestroy()
@Component({
  selector: 'gtrack-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  @Input() timeline$: Observable<Timeline>;
  @Input() weather: WeatherEntity;
  @Input() startDate: Date;
  @Input() speed: number;
  charlimit?: number;
  activeStop: HikeStop;
  timelineRendered = false;

  startTime: {
    hours: number;
    minutes: number;
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly store: Store<any>) {
    this.charlimit = 160 as number; 
    this.speed = 4;
    this.startTime = {
      hours: 5,
      minutes: 0,
    };
  }

  getFirstTypeOfItem(item: TimelineItem): string | undefined {
    return fp.get('stop.poi.types[0]', item);
  }

  isTimelineBadgeIconShown$(index: number): Observable<boolean> {
    return this.timeline$.pipe(
      map(timeline => index > 0 || index < timeline.length - 1)
    );
  }

  // TODO: Move this to a service
  getWeather(date: Date): any {
    const time = date.getTime();

    if (!this.weather) {
      return undefined;
    }

    // Find the closest item
    return this.weather.list.reduce((prev, current) => {
      const diff1 = Math.abs(time - current.dt * 1000);
      const diff2 = Math.abs(time - prev.dt * 1000);

      return diff1 < diff2 ? current : prev;
    });
  }

  getDescription(item: TimelineItem): any {
    return (
      fp.get('stop.description', item) || fp.get('stop.poi.description', item)
    );
  }

  isLastItem$(index: number): Observable<boolean> {
    return this.timeline$.pipe(
      map(timeline => !fp.isEmpty(timeline) && index + 1 === timeline.length)
    );
  }

  generateTimeline(): any {
    // if (!this.startDate) {
    //   return undefined;
    // }
    // const times = this.hike.stops.map((stop, i) => this.getSegmentStartTime(i));
    // const startPosition: Position = [this.hike.stops[0].lon, this.hike.stops[0].lat];
    // const sunrise = this._astronomy.getSunTimes(startPosition, this.startDate);
    // const events = 'dawn sunrise sunset dusk'.split(' ');
    // const icons = {
    //   dawn: '/assets/icons/weather/wi-horizon-alt.svg',
    //   sunrise: '/assets/icons/weather/wi-sunrise.svg',
    //   sunset: '/assets/icons/weather/wi-sunset.svg',
    //   dusk: '/assets/icons/weather/wi-horizon.svg'
    // };
    // const positions = events.map(event =>
    //   times.findIndex((time, i) => {
    //     const nextTime = times[i];
    //     return typeof nextTime !== 'undefined' && nextTime.getTime() >= sunrise[event].getTime();
    //   })
    // );
    // this.stops = this.hike.stops.reduce((array, stop, i: number) => {
    //   const eventIndexes = positions
    //     .map((position, index) => {
    //       if (position === i) {
    //         return index;
    //       } else {
    //         return -1;
    //       }
    //     })
    //     .filter(index => index !== -1);
    //   const time = this.getSegmentStartTime(i);
    //   const weather = this.getWeather(time);
    //   let stopEvents = [
    //     {
    //       icon: 'assets/icons/weather/wi-day-sunny.svg',
    //       title: 'astronomy.day'
    //     }
    //   ];
    //   if (time.getTime() < sunrise.sunrise.getTime()) {
    //     stopEvents = [
    //       {
    //         icon: 'assets/icons/weather/wi-stars.svg',
    //         title: 'astronomy.night'
    //       }
    //     ];
    //   }
    //   const stopWithEvents = {
    //     ...stop,
    //     arrive: time,
    //     events: stopEvents,
    //     weather: []
    //   };
    //   if (weather && weather.weather) {
    //     stopWithEvents.weather = weather.weather;
    //   }
    //   let fakeStops = [];
    //   if (i > 0) {
    //     fakeStops = eventIndexes.map(eventIndex => {
    //       const event = events[eventIndex];
    //       const next = this.hike.stops[i + 1] || {
    //         segment: {}
    //       };
    //       const sunriseWeather = this.getWeather(sunrise[event]);
    //       const fakeStop = {
    //         eventOnly: true,
    //         arrive: sunrise[event],
    //         title: `astronomy.${event}`,
    //         segment: next.segment,
    //         eventIcon: icons[event],
    //         weather: []
    //       };
    //       if (sunriseWeather && sunriseWeather.weather) {
    //         fakeStop.weather = sunriseWeather.weather;
    //       }
    //       return fakeStop;
    //     });
    //   }
    //   return [...array, ...fakeStops, stopWithEvents];
    // }, []);
  }

  showPoiComments(poi: Poi): void {
    if (poi) {
      this.store.dispatch(
        new Go(['messages', 'POI', poi.id], {
          queryParams: {
            data: JSON.stringify({
              description: poi.description,
            }),
          },
        })
      );
    }
  }

  //  showCustomComment(coord: Record<string, unknown>) {
  //    if (coord) {
  //      this.store.dispatch(
  //        new Go(['messages', 'COORD', coord.poiId], {
  //          queryParams: {
  //            data: JSON.stringify({
  //              lat: coord.lat,
  //              lon: coord.lon,
  //            }),
  //          },
  //        })
  //      );
  //    }
  //  }

  getDifficultyColor(difficulty: number): string {
    return DifficultyFp.getColor(difficulty);
  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedLocalizationFeatureIonicModule,
    SharedGenericUiFeatureIonicModule,
    TranslateModule,
    UtilsModule,
    SettingsSharedGenericUiDataAccessModule,
    IonicModule,
    DifficultyComponentModule,
    HikeStopTypesModule,
    PoiIconRowLabelledComponentModule,
    DataBadgeComponentModule,
    SharedLocalizationUiAngularModule,
  ],
  exports: [TimelineComponent],
  declarations: [TimelineComponent, TimelineVerticalLineComponent],
})
export class TimelineComponentModule { }
