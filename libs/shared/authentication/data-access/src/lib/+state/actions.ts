// eslint:disable:no-property-initializers max-classes-per-file
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Action, createAction, props } from '@ngrx/store';
import { Auth } from '../interfaces';

export enum AuthenticationActionTypes {
  INIT = '[Authentication] Init',
  APPLE_LOGIN = '[Authentication] Login with Apple',
  REQUEST_VERIFY_TOKEN = '[Authentication] Request Twitter verify token',
  VERIFY = '[Authentication] Verify user with token',
  FACEBOOK_LOGIN = '[Authentication] Login with Facebook',
  GOOGLE_LOGIN = '[Authentication] Login with Google',
  MAGICLINK_LOGIN = '[Authentication] Login with Magic Link',
  MAGICLINK_REQUEST_TOKEN = '[Authentication] Request a Magic Link',
  MAGICLINK_EMAIL_SENT = '[Authentication] Magic Link email sent',
  LOGIN_SUCCESS = '[Authentication] Login Success',
  AUTH_FINISHED = '[Authentication] Authentication finished',
  FAILURE_HAPPENED = '[Authentication] Login/Logout Error',
  LOGOUT_START = '[Authentication] Logout Start',
  LOGOUT_SUCCESS = '[Authentication] Logout Success',
  UNAUTHORIZED = '[Authentication] Unauthorized',
  ROUTE_FORBIDDEN = '[Authentication] Route forbidden',
  USER_CANCELLED = '[Authentication] User cancelled',
  WINDOW_REOPENED = '[Authentication] Window reopened',
  SELECT_ROLE = '[Authentication] Auth role selected',
  LOGIN_CONTINUED = '[Authentication] Continue login after cognito success',
}

export class Init implements Action {
  readonly type = AuthenticationActionTypes.INIT;
}

export class RequestVerifyToken implements Action {
  readonly type = AuthenticationActionTypes.REQUEST_VERIFY_TOKEN;

  constructor(public email: string) {}
}

export class Verify implements Action {
  readonly type = AuthenticationActionTypes.VERIFY;
  constructor(public token: string, public uid: string) {}
}

export const facebookLogin = createAction(
  AuthenticationActionTypes.FACEBOOK_LOGIN,
  props<{ roles: string[] }>()
);

export const googleLogin = createAction(
  AuthenticationActionTypes.GOOGLE_LOGIN,
  props<{ roles: string[] }>()
);

export const appleLogin = createAction(
  AuthenticationActionTypes.APPLE_LOGIN,
  props<{ roles: string[] }>()
);

export const requestMagicLinkToken = createAction(
  AuthenticationActionTypes.MAGICLINK_REQUEST_TOKEN,
  props<{
    email: string;
    language: string;
    roles: string[];
  }>()
);

export class MagicLinkLogin implements Action {
  readonly type = AuthenticationActionTypes.MAGICLINK_LOGIN;
  constructor(
    public token: string,
    public uid: string,
    public roles: string[]
  ) {}
}

export class MagicLinkEmailSent implements Action {
  readonly type = AuthenticationActionTypes.MAGICLINK_EMAIL_SENT;
}

export class LoginSuccess implements Action {
  readonly type = AuthenticationActionTypes.LOGIN_SUCCESS;
}

export class AuthFinished implements Action {
  readonly type = AuthenticationActionTypes.AUTH_FINISHED;
  constructor(public auth: Auth) {}
}

export class FailureHappened implements Action {
  readonly type = AuthenticationActionTypes.FAILURE_HAPPENED;
  constructor(public error: string) {}
}

export class UserCancelled implements Action {
  readonly type = AuthenticationActionTypes.USER_CANCELLED;
  constructor(public error: string) {}
}

export class WindowReopened implements Action {
  readonly type = AuthenticationActionTypes.WINDOW_REOPENED;
  // Payload: the error object
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(public error: unknown) {}
}

export class LogoutStart implements Action {
  readonly type = AuthenticationActionTypes.LOGOUT_START;
}

export class LogoutSuccess implements Action {
  readonly type = AuthenticationActionTypes.LOGOUT_SUCCESS;
}

export class Unauthorized implements Action {
  readonly type = AuthenticationActionTypes.UNAUTHORIZED;
}

export class RouteForbidden implements Action {
  readonly type = AuthenticationActionTypes.ROUTE_FORBIDDEN;

  constructor(
    public route?: ActivatedRouteSnapshot,
    public state?: RouterStateSnapshot
  ) {}
}

export class SelectRole implements Action {
  readonly type = AuthenticationActionTypes.SELECT_ROLE;
  constructor(public payload: string) {}
}

export class ContinueLogin implements Action {
  readonly type = AuthenticationActionTypes.LOGIN_CONTINUED;
}

export type AllActions =
  | Init
  | RequestVerifyToken
  | Verify
  | ReturnType<typeof facebookLogin>
  | ReturnType<typeof googleLogin>
  | ReturnType<typeof appleLogin>
  | ReturnType<typeof requestMagicLinkToken>
  | MagicLinkLogin
  | MagicLinkEmailSent
  | LoginSuccess
  | FailureHappened
  | LogoutStart
  | LogoutSuccess
  | Unauthorized
  | RouteForbidden
  | UserCancelled
  | WindowReopened
  | SelectRole
  | ContinueLogin
  | AuthFinished;
