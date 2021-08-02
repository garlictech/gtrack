import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureName, State } from './state';

const featureSelector = createFeatureSelector<State>(featureName);

export const getCurrentActivity = createSelector(
  featureSelector,
  (state: State) => state.currentActivity
);

export const isMoving = createSelector(
  featureSelector,
  (state: State) => !!state.isMoving
);

export const currentRecordedRoutePositions = createSelector(
  featureSelector,
  (state: State) => state.recordedCoordinates
);

export const allPassedPois = createSelector(
  featureSelector,
  (state: State) => state.allPassedPois
);

export const newPassedPois = createSelector(
  featureSelector,
  (state: State) => state.newPassedPois
);

export const nextPoiToPass = createSelector(
  featureSelector,
  (state: State) => state.nextPoiToPass
);
