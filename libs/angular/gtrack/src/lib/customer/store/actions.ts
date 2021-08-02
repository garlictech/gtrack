import { createAction, props } from '@ngrx/store';
import { HikeSettings } from './state';
import { Customer } from '@bit/garlictech.universal.gtrack.graphql-api';

export const customerFetch = createAction(
  '[Customer API] Start fetching customer'
);

export const customerFetchFailure = createAction(
  '[Customer API] Customer fetch failure',
  props<{ error: any }>()
);

export const customerFetchSuccess = createAction(
  '[Customer API] Customer fetch success',
  props<{ customer: Customer }>()
);

export const customerSave = createAction(
  '[Customer PAGE] Start saving customer',
  props<{ customer: Customer }>()
);

export const customerSaveFailure = createAction(
  '[Customer API] Customer save failure',
  props<{ error: any }>()
);

export const customerSaveSuccess = createAction(
  '[Customer API] Customer save success'
);

export const changeHikeSettings = createAction(
  '[Customer API] Change hike specific settings',
  props<{ hikeSettings: HikeSettings }>()
);
