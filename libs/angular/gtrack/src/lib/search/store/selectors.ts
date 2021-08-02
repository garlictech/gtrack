import { createFeatureSelector, createSelector } from '@ngrx/store';

import { featureName, SearchState } from './state';

export const searchFeature = createFeatureSelector<SearchState>(featureName);

export const getFilters = createSelector(
  searchFeature,
  (state: SearchState) => state.filters
);

export const getRadius = createSelector(getFilters, filters => filters.radius);

export const getSearchCircle = createSelector(getFilters, filters => ({
  center: filters.center,
  radius: filters.radius,
}));

export const isSearching = createSelector(
  searchFeature,
  state => state.isSearching
);
