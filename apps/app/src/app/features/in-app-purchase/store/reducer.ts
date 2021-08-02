import { createReducer, on, Action } from '@ngrx/store';
import * as fromActions from './actions';
import { State } from './state';

export const initialState: State = {
  products: [],
};

const featureReducer = createReducer(
  initialState,

  on(fromActions.setProducts, (state: State, { payload }) => ({
    ...state,
    products: payload,
  })),

  on(fromActions.resetProducts, (state: State) => ({
    ...state,
    products: [],
  }))
);

export const reducer = (state: State, action: Action): State => {
  return featureReducer(state, action);
};
