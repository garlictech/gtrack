// eslint:disable:no-property-initializers max-classes-per-file
import { createAction, props } from '@ngrx/store';
import { HikeStop } from '@bit/garlictech.universal.gtrack.hike-stops';

export const UpsertHikeStops = createAction(
  '[HikeStops] Upsert stops',
  props<{ stops: HikeStop[] }>()
);

export const AddHikeStops = createAction(
  '[HikeStops] Add stops',
  props<{ stops: HikeStop[] }>()
);

export const DeleteHikeStops = createAction(
  '[HikeStops] Delete hike stops',
  props<{ stops: HikeStop[] }>()
);

export const HikeStopsToggleOnRouteMarkers = createAction(
  '[HikeStops] Toggle on route markers'
);

export const HikeStopsToggleOffRouteMarkers = createAction(
  '[HikeStops] Toggle off route markers'
);
