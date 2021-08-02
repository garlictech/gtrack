import { createReducer, on, Action } from '@ngrx/store';
import * as fromActions from './actions';
import { State } from './state';

export const initialState: State = {
  isSubscribed: false,
};

const featureReducer = createReducer(
  initialState,

  on(fromActions.setSubscription, (state: State) => ({
    ...state,
    isSubscribed: true,
  })),

  on(fromActions.resetSubscription, (state: State) => ({
    ...state,
    isSubscribed: false,
  }))
);

export const reducer = (state: State, action: Action): State => {
  return featureReducer(state, action);
};
