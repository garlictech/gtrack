import { Action, createReducer, on } from '@ngrx/store';
import { State } from './state';
import { setPageBackgroundImage } from './actions';

export const initialState = {};

const featureReducer = createReducer(
  initialState,

  on(setPageBackgroundImage, (state: State, action) => ({
    ...state,
    pageBackgroundImage: action.imageUrl,
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return featureReducer(state, action);
}
