import { createAction, props } from '@ngrx/store';
import { GeneralInfoEntity } from './general-info.models';

export const init = createAction('[GeneralInfo Page] Init');

export const loadGeneralInfoSuccess = createAction(
  '[GeneralInfo/API] Load GeneralInfo Success',
  props<{ generalInfo: GeneralInfoEntity[] }>()
);

export const loadGeneralInfoFailure = createAction(
  '[GeneralInfo/API] Load GeneralInfo Failure',
  props<{ error: any }>()
);
