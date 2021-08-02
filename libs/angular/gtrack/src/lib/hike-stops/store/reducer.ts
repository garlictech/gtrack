// eslint:disable:only-arrow-functions no-small-switch no-duplicated-branches
import { Action, createReducer, on } from '@ngrx/store';
import * as fp from 'lodash/fp';
import * as fromActions from './actions';
import { entityAdapters, State } from './state';

const initialState: State = {
  ...entityAdapters.getInitialState(),
  showOnrouteMarkers: false,
  showOffrouteMarkers: false,
};

const featureReducer = createReducer(
  initialState,

  on(fromActions.UpsertHikeStops, (state: State, action) => ({
    ...entityAdapters.upsertMany(action.stops, state),
    working: false,
    error: undefined,
  })),

  on(fromActions.AddHikeStops, (state: State, action) => ({
    ...entityAdapters.setAll(action.stops, state),
    working: false,
    error: undefined,
  })),

  on(fromActions.DeleteHikeStops, (state: State, { stops }) => ({
    ...entityAdapters.removeMany(fp.map('id', stops), state),
  })),

  on(fromActions.HikeStopsToggleOnRouteMarkers, (state: State) => ({
    ...state,
    showOnrouteMarkers: !state.showOnrouteMarkers,
  })),

  on(fromActions.HikeStopsToggleOffRouteMarkers, (state: State) => ({
    ...state,
    showOffrouteMarkers: !state.showOffrouteMarkers,
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return featureReducer(state, action);
}
