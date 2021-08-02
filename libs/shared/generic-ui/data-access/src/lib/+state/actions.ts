import { createAction, props } from '@ngrx/store';
import { Toast } from '../interfaces';

export const showProgressSpinner = createAction(
  '[UI] Show progress spinner',
  props<{ spinnerId: string; message?: string }>()
);

export const hideProgressSpinner = createAction(
  '[UI] Hide progress spinner',
  props<{ spinnerId: string }>()
);

export const displayToast = createAction('[UI] display toast', props<Toast>());

export const setPageBackgroundImage = createAction(
  '[UI] set page backgroundImage',
  props<{ imageUrl: string }>()
);
