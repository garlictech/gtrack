// eslint:disable:no-property-initializers max-classes-per-file
import { Action } from '@ngrx/store';
import { WeatherEntity } from './state';

export enum WeatherActionTypes {
  GET_FORECAST = '[Weather] Get forecast',
  FORECAST_RETURNED = '[Weather] Forecast returned',
}

export class GetForecast implements Action {
  readonly type = WeatherActionTypes.GET_FORECAST;

  constructor() {}
}

export class ForecastReturned implements Action {
  readonly type = WeatherActionTypes.FORECAST_RETURNED;

  constructor(public forecast: WeatherEntity) {}
}

export type AllWeatherActions = GetForecast | ForecastReturned;
