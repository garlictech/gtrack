import { createFeatureSelector, createSelector } from '@ngrx/store';
import { get as _get } from 'lodash';
import { featureName, State } from './state';

const featureSelector = createFeatureSelector<State>(featureName);

export const getHike = createSelector(
  featureSelector,
  (state: State) => state.hike
);

export const getResolvedHike = createSelector(
  featureSelector,
  (state: State) => state.resolvedHike
);

export const getCalculatedHike = createSelector(
  featureSelector,
  (state: State) => state.resolvedHike && state.resolvedHike.hike
);

export const getWorking = createSelector(
  featureSelector,
  (state: State) => state.working
);

export const getError = createSelector(featureSelector, (state: State) =>
  _get(state, 'failed')
);

export const isDirty = createSelector(
  featureSelector,
  (state: State) => state.dirty
);
