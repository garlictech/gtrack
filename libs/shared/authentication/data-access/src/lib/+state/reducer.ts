// eslint:disable:only-arrow-functions no-small-switch
import { AllActions as Action, AuthenticationActionTypes } from './actions';
import { AuthenticationState } from './state';
import { ActionReducer } from '@ngrx/store';

const initialState: AuthenticationState = {
  loggingIn: true,
  failed: undefined,
  emailSent: false,
  loginRefused: false,
  selectedRole: 'user',
};

export function reducer(
  state = initialState,
  action: Action
): AuthenticationState {
  switch (action.type) {
    case AuthenticationActionTypes.APPLE_LOGIN:
    case AuthenticationActionTypes.REQUEST_VERIFY_TOKEN:
    case AuthenticationActionTypes.FACEBOOK_LOGIN:
    case AuthenticationActionTypes.GOOGLE_LOGIN:
    case AuthenticationActionTypes.MAGICLINK_REQUEST_TOKEN:
    case AuthenticationActionTypes.VERIFY:
    case AuthenticationActionTypes.MAGICLINK_LOGIN:
      return { ...state, loggingIn: true, failed: undefined };

    case AuthenticationActionTypes.MAGICLINK_EMAIL_SENT:
      return { ...state, emailSent: true, failed: undefined, loggingIn: false };

    case AuthenticationActionTypes.AUTH_FINISHED:
      return {
        ...state,
        ...{ auth: action.auth },
        loggingIn: false,
        failed: undefined,
        emailSent: false,
      };

    case AuthenticationActionTypes.USER_CANCELLED:
    case AuthenticationActionTypes.FAILURE_HAPPENED:
      return {
        ...state,
        ...{ failed: action.error },
        loggingIn: false,
        emailSent: false,
      };

    case AuthenticationActionTypes.LOGOUT_START:
      return { ...state };

    case AuthenticationActionTypes.LOGOUT_SUCCESS:
      return { ...initialState, loggingIn: false };

    case AuthenticationActionTypes.LOGIN_CONTINUED:
      return { ...state, loggingIn: true };

    case AuthenticationActionTypes.SELECT_ROLE:
      return { ...state, selectedRole: action.payload };

    default:
      return state;
  }
}

export function logout(_reducer: ActionReducer<AuthenticationState, Action>) {
  return function (
    state: AuthenticationState,
    action: Action
  ): AuthenticationState {
    return _reducer(
      action.type === AuthenticationActionTypes.LOGOUT_SUCCESS
        ? undefined
        : state,
      action
    );
  };
}

export const metaReducers = [logout];
