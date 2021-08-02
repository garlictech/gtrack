import { Injectable } from '@angular/core';
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import {
  featureName,
  weatherAdapter,
  weatherContextAdapter,
  WeatherContextState,
  WeatherEntity,
  WeatherState,
} from './state';

@Injectable()
export class WeatherSelectors {
  /*selectFeature: MemoizedSelector<unknown, WeatherState>;
  getAllWeathers: (state: Record<string, unknown>) => WeatherEntity[];
  getAllContexts: (state: Record<string, unknown>) => WeatherContextState[];

  constructor() {
    this.selectFeature = createFeatureSelector<WeatherState>(featureName);

    const weatherSelector = createSelector(
      this.selectFeature,
      (state: WeatherState) => state.weathers
    );
    const contextSelector = createSelector(
      this.selectFeature,
      (state: WeatherState) => state.contexts
    );

    const selectors = weatherAdapter.getSelectors(weatherSelector);
    const contextSelectors = weatherContextAdapter.getSelectors(
      contextSelector
    );

    this.getAllWeathers = selectors.selectAll;
    this.getAllContexts = contextSelectors.selectAll;
  }

  getWeather(position: Position): MemoizedSelector<unknown, WeatherEntity> {
    const context = `${position[0]}-${position[1]}`;

    return createSelector(this.getAllWeathers, (weathers: WeatherEntity[]) =>
      weathers.find(weather => weather.id === context)
    );
  }

  getWeatherContext(
    position: Position
  ): MemoizedSelector<unknown, WeatherContextState> {
    const id = `${position[0]}-${position[1]}`;

    return createSelector(this.getAllContexts, contexts =>
      contexts.find(context => context.id === id)
    );
  }*/
}
