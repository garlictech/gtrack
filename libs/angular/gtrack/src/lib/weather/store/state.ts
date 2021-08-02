import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { OpenWeatherMapForecast } from '../interfaces';

export interface WeatherEntity extends OpenWeatherMapForecast {
  id: string;
}

export const weatherAdapter = createEntityAdapter<WeatherEntity>();
export type WeatherEntityState = EntityState<WeatherEntity>;

export interface WeatherContextState {
  id: string;
  loading: boolean;
  loaded: boolean;
}

export type AllWeatherContextState = EntityState<WeatherContextState>;

export const weatherContextAdapter = createEntityAdapter<WeatherContextState>();

export interface WeatherState {
  weathers: WeatherEntityState;
  contexts: AllWeatherContextState;
}

export const featureName = 'features.weather';
