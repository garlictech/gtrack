import { Action, createReducer, on } from '@ngrx/store';
import * as fromActions from './actions';
import {
  hikeSettingsEntityStateAdapter,
  initialState,
  CustomerState,
} from './state';

const featureReducer = createReducer(
  initialState,
  on(fromActions.changeHikeSettings, (state, { hikeSettings }) => ({
    ...state,
    hikeSettings: hikeSettingsEntityStateAdapter.upsertOne(
      hikeSettings,
      state.hikeSettings
    ),
  })),
  on(fromActions.customerFetch, fromActions.customerSave, state => ({
    ...state,
    working: true,
    error: undefined,
  })),
  on(
    fromActions.customerFetchFailure,
    fromActions.customerSaveFailure,
    (state, { error }) => ({ ...state, working: false, error })
  ),
  on(fromActions.customerFetchSuccess, (state, { customer }) => ({
    ...state,
    working: false,
    error: undefined,
    customer,
  })),
  on(fromActions.customerSaveSuccess, state => ({
    ...state,
    working: false,
    error: undefined,
  }))
);

export function reducer(state: CustomerState, action: Action): CustomerState {
  return featureReducer(state, action);
}
