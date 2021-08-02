import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureName, State } from './state';

const featureSelector = createFeatureSelector<State>(featureName);

export const isSubscribed = createSelector(
  featureSelector,
  (state: State) => state.isSubscribed
);
