// eslint:disable:only-arrow-functions no-small-switch no-duplicated-branches
import { Action, createReducer } from '@ngrx/store';
import { State } from './state';

const featureReducer = createReducer({});

export function reducer(state: State, action: Action): State {
  return featureReducer(state, action);
}
