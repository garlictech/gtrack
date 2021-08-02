// eslint:disable:no-property-initializers max-classes-per-file
import { createAction, props } from '@ngrx/store';

export const resetMap = createAction('[Leaflet Map] Reset Map');

export const registerMap = createAction(
  '[Leaflet Map] Register Map',
  props<{ mapId: string }>()
);

export const setSpinning = createAction(
  '[Leaflet Map] Set spinning',
  props<{ spinning: boolean }>()
);
