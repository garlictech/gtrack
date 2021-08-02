import { createFeatureSelector, createSelector } from '@ngrx/store';
import { get } from 'lodash';
import { EGeolocationType } from '../interfaces';
import { CurrentGeolocationState, featureName } from './state';

export const selectFeature = createFeatureSelector<CurrentGeolocationState>(
  featureName
);

export const selectTracking = createSelector(
  selectFeature,
  (state: CurrentGeolocationState) => state.tracking
);

export const selectCurrentLocation = createSelector(
  selectFeature,
  (state: CurrentGeolocationState) => state.currentLocation
);

export const isFromGps = createSelector(
  selectFeature,
  (state: CurrentGeolocationState) =>
    get(state, 'currentLocation.type') === EGeolocationType.BROWSER
);
