import * as O from 'fp-ts/lib/Option';
import { RouteFp } from '@bit/garlictech.universal.gtrack.route';
import { EBuffer } from '@bit/garlictech.universal.gtrack.route-segment';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { get, isEmpty, isEqual, last, size } from 'lodash';
import { featureName, State } from './state';
import { GtrackDefaults } from '@bit/garlictech.universal.gtrack.defaults/defaults';

const featureSelector = createFeatureSelector<State>(featureName);

export const getSegments = createSelector(
  featureSelector,
  (state: State) => state.segments
);

export const noSegments = createSelector(
  getSegments,
  segments => !segments || segments.length === 0
);

export const getRoute = createSelector(getSegments, segments =>
  RouteFp.fromRouteSegments(GtrackDefaults.averageSpeed())(segments)
);

export const getLastSegment = createSelector(getSegments, segments =>
  last(segments)
);

export const segmentNumber = createSelector(getSegments, segments =>
  size(segments)
);

export const getRouteStartPoint = createSelector(
  featureSelector,
  state => state.startPoint
);

export const getRouteEndPoint = createSelector(
  getRoute,
  getRouteStartPoint,
  (route, startPoint) => (O.isSome(route) ? route.value.endPoint : startPoint)
);

export const getIsRouting = createSelector(
  featureSelector,
  (state: State) => state.routing
);

export const getIsRoundTrip = createSelector(
  getRouteStartPoint,
  getRouteEndPoint,
  (startPoint, endPoint) =>
    !isEmpty(startPoint) && isEqual(startPoint, endPoint)
);

export const getRouteBufferFeature = createSelector(
  featureSelector,
  (state: State, whichBuffer: EBuffer) =>
    get(state.routeBuffers[whichBuffer], 'mapLayer')
);

export const isRouteBufferShown = createSelector(
  featureSelector,
  (state: State, whichBuffer: EBuffer) =>
    get(state.routeBuffers[whichBuffer], 'shown')
);

export const canCloseCircle = createSelector(
  getIsRoundTrip,
  segmentNumber,
  (isRoundtrip, segmentNo) => !isRoundtrip && segmentNo > 1
);

export const getWaypoints = createSelector(
  featureSelector,
  state => state.waypoints
);
