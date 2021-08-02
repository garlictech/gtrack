// eslint:disable:only-arrow-functions
import { InjectionToken } from '@angular/core';
import { ActionReducer, ActionReducerMap } from '@ngrx/store';

/* import { weatherReducer } from './reducer';
 */import { WeatherState } from './state';

export * from './actions';
export * from './selectors';
/* export * from './effects';
 */export * from './reducer';
export * from './state';

/* export function getReducers(): ActionReducer<WeatherState> {
  return weatherReducer;
} */

export const WEATHER_REDUCER_TOKEN = new InjectionToken<
  ActionReducerMap<WeatherState>
>('Registered Weather Reducers');
