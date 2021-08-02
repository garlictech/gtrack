// eslint:disable:only-arrow-functions no-small-switch
import { Action, createReducer, on } from '@ngrx/store';
import * as fromActions from './actions';
import { State } from './state';
import * as fp from 'lodash/fp';

export const initialState: State = {
  isMoving: false,
  recordedCoordinates: [],
  allPassedPois: [],
  newPassedPois: [],
};

const featureReducer = createReducer(
  initialState,

  on(fromActions.stopCurrentActivity, () => fp.cloneDeep(initialState)),

  on(fromActions.resetCurrentActivity, (state: State) => ({
    ...state,
    isMoving: false,
    recordedCoordinates: [],
    passedPois: [],
  })),

  on(fromActions.startActivity, (state: State, action) => ({
    ...state,
    currentActivity: { ...action.currentActivity },
  })),

  on(fromActions.startMoving, (state: State) => ({
    ...state,
    isMoving: true,
  })),

  on(fromActions.pauseMoving, (state: State) => ({
    ...state,
    isMoving: false,
  })),

  on(fromActions.updateRecordedPositions, (state: State, action) => ({
    ...state,
    recordedCoordinates: action.newPositions,
  })),

  on(fromActions.setNextPoiToPass, (state: State, action) => ({
    ...state,
    nextPoiToPass: action.poi,
  })),

  on(fromActions.updatePassedPois, (state: State, action) => ({
    ...state,
    allPassedPois: fp.cloneDeep(action.pois),
    newPassedPois: fp.flow(
      () =>
        fp.differenceWith(
          (poi1, poi2) => poi1.id === poi2.id,
          action.pois,
          state.allPassedPois
        ),
      fp.cloneDeep
    )(),
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return featureReducer(state, action);
}
