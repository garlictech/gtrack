// eslint:disable:only-arrow-functions no-small-switch
import { Action, ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';
import { AllWeatherActions, WeatherActionTypes } from './actions';
import {
  AllWeatherContextState,
  weatherAdapter,
  weatherContextAdapter,
  WeatherEntityState,
  WeatherState,
} from './state';

export const weatherContextReducerIntialState = weatherContextAdapter.getInitialState();
export const weatherReducerInitialState = weatherAdapter.getInitialState();

/*  const contextReducer: ActionReducer<AllWeatherContextState> = (
  state: AllWeatherContextState = weatherContextReducerIntialState,
  action: AllWeatherActions
): AllWeatherContextState => {
    switch (action.type) {
      case WeatherActionTypes.GET_FORECAST:
        return weatherContextAdapter.upsertOne(
          {
            id: `${action.position[0]}-${action.position[1]}`,
            loading: true,
            loaded: false,
          },
          state
        );
  
      case WeatherActionTypes.FORECAST_RETURNED:
        return weatherContextAdapter.upsertOne(
          {
            id: action.forecast.id,
            loading: false,
            loaded: true,
          },
          state
        );
  
      default: 
        return state;
    }
  return state;

};*/

/* const reducer: ActionReducer<WeatherEntityState> = (
  state: WeatherEntityState = weatherReducerInitialState,
  action: AllWeatherActions
): WeatherEntityState => {
  switch (action.type) {
    case WeatherActionTypes.FORECAST_RETURNED:
      return weatherAdapter.upsertOne(action.forecast, state);

    default:
      return state;
  }
}; */

/* const reducerMap: ActionReducerMap<WeatherState> = {
  contexts: contextReducer,
  weathers: reducer,
}; */

/* export const weatherReducer = combineReducers(reducerMap);
 */