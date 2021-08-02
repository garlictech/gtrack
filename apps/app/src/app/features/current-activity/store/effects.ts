import { NGXLogger } from 'ngx-logger'; // eslint:disable:no-property-initializers
import { Injectable } from '@angular/core';
import { RouterActions } from '@bit/garlictech.angular.gtrack.router';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import * as CurrentActivityActions from './actions';
import * as CurrentActivitySelectors from './selectors';
import {
  map,
  tap,
  filter,
  switchMap,
  withLatestFrom,
  distinctUntilChanged,
  mergeMap,
} from 'rxjs/operators';
import { log } from '@app/log';
import { Store } from '@ngrx/store';
import * as fp from 'lodash/fp';
import {
  Poi,
  TextualDescription,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { DescriptionLanguageListService } from '@gtrack/shared/localization/data-access';
import { PoiStampService } from '../poi-stamp/poi-stamp.service';
import { of, from, combineLatest } from 'rxjs';
import { GeoLocationService } from '@bit/garlictech.angular.gtrack.current-geolocation';

@Injectable()
export class Effects {
  constructor(
    private readonly log: NGXLogger,
    private readonly actions$: Actions,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly descLangList: DescriptionLanguageListService,
    private readonly stampService: PoiStampService,
    private readonly _geolocationService: GeoLocationService
  ) {}

  startActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentActivityActions.startActivity),
      tap(() =>
        this.log.info(`Executing effect 'current-activity.startActivity$'`)
      ),
      map(() => new RouterActions.Go(['/', 'tabs', 'activity']))
    )
  );

  recordRoute$ = createEffect(() =>
    this.store.select(CurrentActivitySelectors.isMoving).pipe(
      distinctUntilChanged(fp.isEqual),
      filter(isMoving => isMoving),
      tap(() =>
        this.log.info(`Executing effect 'current-activity.recordRoute$'`)
      ),
      switchMap(() =>
        this._geolocationService.getLocation().pipe(
          withLatestFrom(
            this.store.select(
              CurrentActivitySelectors.currentRecordedRoutePositions
            )
          ),
          map(([currentLocation, currentRecordedRoutePositions]) => [
            ...currentRecordedRoutePositions,
            currentLocation,
          ]),

          map(newPositions =>
            CurrentActivityActions.updateRecordedPositions({ newPositions })
          )
        )
      )
    )
  );

  displayPoiStamp$ = createEffect(
    () =>
      this.store.select(CurrentActivitySelectors.newPassedPois).pipe(
        distinctUntilChanged(fp.isEqual),
        withLatestFrom(this.store.select(CurrentActivitySelectors.isMoving)),
        filter(([, isMoving]) => isMoving),
        mergeMap(([pois]) => from(pois)),
        mergeMap((poi: Poi) =>
          combineLatest([
            this.descLangList
              .getLocalizedDescription(poi.description)
              .pipe(map((desc: TextualDescription) => desc.title)),
            of(poi.types[0]),
          ])
        ),
        tap(([title, iconType]: [string, string]) =>
          this.stampService.show(title, iconType)
        )
      ),
    { dispatch: false }
  );
}
