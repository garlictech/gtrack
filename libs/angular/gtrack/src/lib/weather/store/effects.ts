/* // eslint:disable:no-property-initializers
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

import { WeatherService } from '../services';
import * as LocalActions from './actions';

@Injectable()
export class WeatherEffects {
  @Effect() getForecast$: Observable<Action> = this._actions$.pipe(
    ofType<LocalActions.GetForecast>(
      LocalActions.WeatherActionTypes.GET_FORECAST
    ),
    mergeMap(action =>
      this._weatherService.getWeather(action.position).pipe(
        take(1),
        map(
          forecast =>
            new LocalActions.ForecastReturned({
              ...forecast,
              id: `${action.position[0]}-${action.position[1]}`,
            })
        )
      )
    )
  );

  constructor(
    private readonly _actions$: Actions,
    private readonly _weatherService: WeatherService
  ) {}
}
 */