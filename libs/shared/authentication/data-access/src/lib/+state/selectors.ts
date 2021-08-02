import { createFeatureSelector, createSelector } from '@ngrx/store';
import { get as _get } from 'lodash';
import { Auth, User } from '../interfaces';
import { AuthenticationState, featureName } from './state';

const selectFeature = createFeatureSelector<AuthenticationState>(featureName);

const selectAuth = createSelector(
  selectFeature,
  (state: AuthenticationState) => state.auth
);

export const selectUser = createSelector(
  selectAuth,
  (state: Auth | undefined) => state?.user
);

export const selectRole = createSelector(
  selectUser,
  (user: User | undefined) => user?.roles?.[0]
);

export const selectUserId = createSelector(selectUser, (user: User | undefined) =>
  _get(user, 'id')
);
export const selectCustomerId = createSelector(selectUser, (user: User | undefined) =>
  _get(user, 'customerId')
);

export const loggedIn = createSelector(selectUser, (user: User | undefined) => !!user);

export const loggedOut = createSelector(loggedIn, (isLoggedIn: boolean) => !isLoggedIn);

export const selectToken = createSelector(selectAuth, (state: any) =>
  _get(state, 'token')
);

export const loggingIn = createSelector(
  selectFeature,
  (state: { loggingIn: any; }) => state.loggingIn
);

export const selectAuthHeader = createSelector(
  selectToken,
  (token: any) => (!!token && `Bearer ${token}`) || undefined
);

export const magicLinkEmailSent = createSelector(
  selectFeature,
  (state: { emailSent: any; }) => state.emailSent
);

export const loginFailed = createSelector(
  selectFeature,
  (jwtState: AuthenticationState) => jwtState.failed
);

export const selectedRole = createSelector(
  selectFeature,
  (state: { selectedRole: any; }) => state.selectedRole
);
