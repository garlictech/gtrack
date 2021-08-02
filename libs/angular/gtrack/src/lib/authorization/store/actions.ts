import { createAction } from '@ngrx/store';

export enum AuthorizationActionTypes {
  SET_SUBSCRIPTION = '[Authorization] Set subscription state',
  RESET_SUBSCRIPTION = '[Authorization] Reset subscription state',
}

export const setSubscription = createAction(
  AuthorizationActionTypes.SET_SUBSCRIPTION
);

export const resetSubscription = createAction(
  AuthorizationActionTypes.RESET_SUBSCRIPTION
);
