import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureName, State } from './state';

export const selectFeature = createFeatureSelector<State>(featureName);

export const currentBackgroundImageSelector = createSelector(
  selectFeature,
  (state: State) => state.pageBackgroundImage
);
