// eslint:disable:only-arrow-functions
import { Action, createReducer, on } from '@ngrx/store';
import * as fp from 'lodash/fp';
import * as fromActions from './actions';
import { SearchState } from './state';

export const initialState: SearchState = {
  filters: {
    difficulty: [0, 4],
    length: [0, 50000],
    time: [0, 1440],
    location: 'my-location',
    radius: 50000,
    center: {
      lat: 0,
      lon: 0,
    },
  },
  isSearching: false,
};

const featureReducer = createReducer(
  initialState,
  on(fromActions.ChangeFilters, (state, action) => {
    const newState = fp.cloneDeep(state);
    newState.filters = { ...state.filters, ...action };
    return newState;
  }),
  on(fromActions.ResetFilters, () => ({
    ...initialState,
  })),
  on(fromActions.SearchingStarted, state => {
    const newState = fp.cloneDeep(state);
    newState.isSearching = true;
    return newState;
  }),
  on(fromActions.SearchingFinished, state => {
    const newState = fp.cloneDeep(state);
    newState.isSearching = false;
    return newState;
  })
);

export function reducer(state: SearchState, action: Action): SearchState {
  return featureReducer(state, action);
}
