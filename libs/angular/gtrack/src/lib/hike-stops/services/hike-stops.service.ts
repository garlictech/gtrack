import { Injectable } from '@angular/core';
import { LocalizationSelectors } from '@gtrack/shared/localization/data-access';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as fp from 'lodash/fp';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { HikeStopSelectors } from '../store/';
import {
  HikeStopSetDetails,
  HikeStop,
  HikeStopFp,
} from '@bit/garlictech.universal.gtrack.hike-stops';
import { sequenceS } from 'fp-ts/lib/Apply';
import * as O from 'fp-ts/lib/Option';
import { pipe, flow } from 'fp-ts/lib/function';

export interface OnOffrouteStopsDetails {
  onRoute?: HikeStopSetDetails;
  offRoute?: HikeStopSetDetails;
}

@Injectable({ providedIn: 'root' })
export class HikeStopsService {
  constructor(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly translate: TranslateService
  ) {}

  private static stopHandler = flow(
    distinctUntilChanged(fp.isEqual),
    map(stops => (fp.isArray(stops) ? stops : []))
  );

  onrouteStops$(hikeId: string): Observable<HikeStop[]> {
    return this.store
      .select(
        HikeStopSelectors.onrouteHikeStopsSortedByDistanceFromOrigo(hikeId)
      )
      .pipe(HikeStopsService.stopHandler);
  }

  offrouteStops$(hikeId: string): Observable<HikeStop[]> {
    return this.store
      .select(
        HikeStopSelectors.offrouteHikeStopsSortedByDistanceFromOrigo(hikeId)
      )
      .pipe(HikeStopsService.stopHandler);
  }

  getDetailsOfStops(
    stops: HikeStop[]
  ): Observable<O.Option<HikeStopSetDetails>> {
    return this.translate.get('foobar').pipe(
      switchMap(() => this.store.select(LocalizationSelectors.currentLanguage)),
      map(currentLanguage =>
        HikeStopFp.getDetailsOfStops(currentLanguage)({
          translate: what => this.translate.instant(what),
        })(stops)
      )
    );
  }

  getDetailsOfOnOffRouteStops$(
    hikeId: string
  ): Observable<OnOffrouteStopsDetails> {
    return this.translate.get('foobar').pipe(
      switchMap(() =>
        combineLatest([
          this.store.select(LocalizationSelectors.currentLanguage),
          this.onrouteStops$(hikeId),
          this.offrouteStops$(hikeId),
        ])
      ),
      map(([currentLanguage, onrouteStops, offrouteStops]) => {
        const detailGetter = HikeStopFp.getDetailsOfStops(currentLanguage)({
          translate: what => this.translate.instant(what),
        });

        return pipe(
          {
            onRoute: detailGetter(onrouteStops),
            offRoute: detailGetter(offrouteStops),
          },
          sequenceS(O.option),
          O.getOrElse(() => ({}))
        );
      })
    );
  }
}
