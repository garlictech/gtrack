import { LocalizationSelectors } from '@gtrack/shared/localization/data-access';
import { Injectable } from '@angular/core';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { HikeStopsService } from '@bit/garlictech.angular.gtrack.hike-stops';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, take, switchMap, withLatestFrom } from 'rxjs/operators';

import { Timeline } from '@bit/garlictech.universal.gtrack.timeline/lib/types';
import { Store } from '@ngrx/store';
import { TimelineFp } from '@bit/garlictech.universal.gtrack.timeline';
import { fromWorker } from 'observable-webworker';
import {
  CreateTimelineOutput,
  CreateTimelineInput,
} from '../../webworkers/create-timeline/types';

@Injectable({ providedIn: 'root' })
export class TimelineService {
  constructor(
    private readonly translateService: TranslateService,
    private readonly hikeStops: HikeStopsService,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>
  ) {}

  createTimeline = (averageSpeed: number) => (
    hike: CalculatedHike
  ): Observable<Timeline> =>
    // the translate get is to ensure that the translations are loaded
    this.translateService.get('foobar').pipe(
      take(1),
      switchMap(() =>
        combineLatest([
          this.hikeStops.onrouteStops$(hike.data.id),
          this.hikeStops.offrouteStops$(hike.data.id),
        ])
      ),
      take(1),
      switchMap(([onrouteStops, offrouteStops]) =>
        fromWorker<CreateTimelineInput, CreateTimelineOutput>(
          () =>
            new Worker(
              '../../webworkers/create-timeline/create-timeline.worker',
              {
                type: 'module',
              }
            ),
          of({
            deps: {
              averageSpeed,
              onrouteStops,
              offrouteStops,
            },
            hike,
          })
        )
      ),
      withLatestFrom(this.store.select(LocalizationSelectors.currentLanguage)),
      map(([timeline, currentLanguage]) =>
        TimelineFp.addStopDetails({
          currentLanguage,
          translator: {
            translate: what => this.translateService.instant(what),
          },
        })(timeline)
      )
    );
}
