// eslint:disable:only-arrow-functions no-small-switch
import { RouteSegment } from '@bit/garlictech.universal.gtrack.route-segment';
import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { cloneDeep as _cloneDeep, first, get, initial, set } from 'lodash';
import * as fp from 'lodash/fp';
import * as actions from './actions';
import { State } from './state';

export const initialRouteInfoDataState: State = {
  segments: [],
  routing: false,
  routeBuffers: {},
};

const newStartPoint = (oldStartPoint: Point, segments: RouteSegment[]) =>
  get(first(segments), 'startPoint', oldStartPoint);

// export function hikeRoutePlannerReducer(
export function reducer(
  state = initialRouteInfoDataState,
  action: actions.AllRoutePlannerActions | RouterNavigationAction
): State {
  const newState = _cloneDeep(state);

  switch (action.type) {
    case actions.REMOVE_SEGMENTS:
      newState.segments.splice(action.idx, action.count);

      return newState;

    case actions.POP_SEGMENT:
      return {
        ...state,
        segments: initial(state.segments),
      };

    case actions.routingError.type:
      return {
        ...state,
        failure: action.error,
      };

    case actions.displayBufferOnMap.type: {
      set(newState.routeBuffers, `${action.whichBuffer}.shown`, true);

      return newState;
    }

    case actions.hideBuffer.type: {
      set(newState.routeBuffers, `${action.whichBuffer}.shown`, false);

      return newState;
    }

    case actions.deletePlan.type: {
      return initialRouteInfoDataState;
    }

    case actions.addWaypoint.type: {
      return {
        ...state,
        failure: undefined,
        // routing: true
      };
    }

    case actions.routeSegmentCreated.type: {
      const newSegments = [...state.segments, action.segment];

      return {
        ...state,
        routing: false,
        failure: undefined,
        segments: [...state.segments, action.segment],
        startPoint: newStartPoint(state.startPoint, newSegments),
      };
    }

    case actions.setStartPoint.type: {
      return {
        ...state,
        failure: undefined,
        startPoint: action.startPoint,
      };
    }

    case actions.replaceSegment.type: {
      newState.segments.splice(action.segmentIndex, 1, action.newSegment);

      return {
        ...newState,
        failure: undefined,
        startPoint: newStartPoint(state.startPoint, newState.segments),
      };
    }

    case actions.waypointMoved.type: {
      return {
        ...newState,
        failure: undefined,
      };
    }

    case ROUTER_NAVIGATION: {
      return fp.cloneDeep(initialRouteInfoDataState);
    }

    default:
      return state;
  }
}
