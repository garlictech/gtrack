// eslint:disable:no-property-initializers max-classes-per-file
import {
  EBuffer,
  RouteSegment,
} from '@bit/garlictech.universal.gtrack.route-segment';
import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';
import { Action, createAction, props } from '@ngrx/store';

export const REMOVE_SEGMENTS = '[HikeRoutePlanner] Remove segments';
export const POP_SEGMENT = '[HikeRoutePlanner] Pop segment';
export const UPDATE_TOTAL = '[HikeRoutePlanner] Update total';
export const SET_LOCATION = '[HikeRoutePlanner] Set location';

export class RemoveSegments implements Action {
  readonly type = REMOVE_SEGMENTS;
  constructor(public idx: number, public count: number) {}
}

export class PopSegment implements Action {
  readonly type = POP_SEGMENT;
}
export const displayBufferOnMap = createAction(
  '[HikeRoutePlanner]: Dispay the buffer on the map',
  props<{ whichBuffer: EBuffer }>()
);

export const hideBuffer = createAction(
  '[HikeRoutePlanner]: Remove a route buffer',
  props<{ whichBuffer: EBuffer }>()
);

export const deletePlan = createAction('[HikeRoutePlanner] Delete plan');

export const addWaypoint = createAction(
  '[HikeRoutePlanner] Add a waypoint',
  props<{ wayPoint: Point }>()
);

export const routeSegmentCreated = createAction(
  '[HikeRoutePlanner] Route segment created',
  props<{ segment: RouteSegment }>()
);

export const setStartPoint = createAction(
  '[HikeRoutePlanner] Set start point',
  props<{ startPoint: Point }>()
);

export const waypointMoved = createAction(
  '[HikeRoutePlanner] Waypoint moved',
  props<{ newPoint: Point; waypointIndex: number }>()
);

export const replaceSegment = createAction(
  '[HikeRoutePlanner] Replace a segment',
  props<{ newSegment: RouteSegment; segmentIndex: number }>()
);

export const routingError = createAction(
  '[HikeRoutePlanner] Routing error',
  props<{ error?: string }>()
);

export const closeCircle = createAction('[HikeRoutePlanner] Close circle');

export const generateCheckpoints = createAction(
  '[HikeRoutePlanner] Generate checkpoints'
);

export type AllRoutePlannerActions =
  | RemoveSegments
  | PopSegment
  | ReturnType<typeof displayBufferOnMap>
  | ReturnType<typeof hideBuffer>
  | ReturnType<typeof deletePlan>
  | ReturnType<typeof addWaypoint>
  | ReturnType<typeof routeSegmentCreated>
  | ReturnType<typeof setStartPoint>
  | ReturnType<typeof waypointMoved>
  | ReturnType<typeof replaceSegment>
  | ReturnType<typeof routingError>
  | ReturnType<typeof closeCircle>
  | ReturnType<typeof generateCheckpoints>;
