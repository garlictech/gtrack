import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureName, State } from './state';

export const featureSelector = createFeatureSelector<State>(featureName);

export const getHeading = createSelector(
  featureSelector,
  (state: State) => state.heading
);
