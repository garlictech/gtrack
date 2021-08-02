// eslint:disable:only-arrow-functions no-small-switch
import { Action, createReducer, on } from '@ngrx/store';
import * as fromActions from './actions';
import { State } from './state';

export const initialState: State = {};

const featureReducer = createReducer(
  initialState,

  on(fromActions.resetMap, () => ({
    ...initialState,
  })),

  on(fromActions.registerMap, (state: State, action) => ({
    ...state,
    mapId: action.mapId,
  })),

  on(fromActions.setSpinning, (state: State, action) => ({
    ...state,
    spinning: action.spinning,
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return featureReducer(state, action);
}
