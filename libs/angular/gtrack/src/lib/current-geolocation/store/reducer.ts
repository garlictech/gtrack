// eslint:disable:only-arrow-functions no-small-switch
import { Actions, CurrentGeolocationActionTypes } from './actions';
import { CurrentGeolocationState } from './state';

export const initialState: CurrentGeolocationState = {
  currentLocation: undefined,
  tracking: false,
};

export function reducer(
  state = initialState,
  action: Actions
): CurrentGeolocationState {
  switch (action.type) {
    case CurrentGeolocationActionTypes.CURRENT_LOCATION_OBTAINED:
      return { ...state, currentLocation: action.location };

    case CurrentGeolocationActionTypes.START_POSITIONING:
      return { ...state, tracking: true };

    case CurrentGeolocationActionTypes.END_POSITIONING:
      return { ...state, tracking: false };

    default:
      return state;
  }
}
