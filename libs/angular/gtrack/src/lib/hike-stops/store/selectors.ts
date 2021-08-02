import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import * as fp from 'lodash/fp';
import { entityAdapters, featureName, State } from './state';
import { HikeStop } from '@bit/garlictech.universal.gtrack.hike-stops';

const featureSelector = createFeatureSelector<State>(featureName);

export const {
  selectIds: selectHikeStopIds,
  selectEntities: selectHikeStopEntities,
  selectAll: selectAllHikeStops,
  selectTotal: selectTotalHikeStopCount,
} = entityAdapters.getSelectors(featureSelector);

export const isLoadingHikeStops = createSelector(
  featureSelector,
  state => state.working
);

export const loadingHikeStopsError = createSelector(
  featureSelector,
  state => state.error
);

export const stopsOfHike = (
  hikeId: string
): MemoizedSelector<State, HikeStop[]> =>
  createSelector(selectAllHikeStops, stops => fp.filter({ hikeId }, stops));

export const onrouteHikeStopsSortedByDistanceFromOrigo = (
  hikeId: string
): MemoizedSelector<State, HikeStop[]> =>
  createSelector(
    stopsOfHike(hikeId),
    fp.flow(
      fp.filter({ onRoute: true }),
      fp.sortBy<HikeStop>(['distanceFromStart'])
    )
  );

export const offrouteHikeStopsSortedByDistanceFromOrigo = (
  hikeId: string
): MemoizedSelector<State, HikeStop[]> =>
  createSelector(
    stopsOfHike(hikeId),
    fp.flow(
      fp.filter({ onRoute: false, inBigBuffer: true }),
      fp.sortBy<HikeStop>(['distanceFromStart'])
    )
  );

export const isPoiFound = createSelector(
  selectTotalHikeStopCount,
  count => count > 0
);
