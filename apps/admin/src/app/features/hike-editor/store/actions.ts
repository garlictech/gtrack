// eslint:disable:no-property-initializers max-classes-per-file
import { HikeData } from '@bit/garlictech.universal.gtrack.graphql-api';
import { createAction, props } from '@ngrx/store';
import { ResolvedHikeData } from '@bit/garlictech.universal.gtrack.hike/lib/types';

export const setHikeEditorDirtyState = createAction(
  '[Hike Editor]: Set dirty state',
  props<{ state: boolean }>()
);

export const updateHike = createAction(
  '[Hike Editor]: Update a hike property',
  props<{ hikeProperties: Partial<HikeData> }>()
);

export const updateResolvedHike = createAction(
  '[Hike Editor]: Update the resolved hike',
  props<{ resolvedHike: ResolvedHikeData }>()
);

export const resetHike = createAction('[Hike Editor]: Reset the hike');
