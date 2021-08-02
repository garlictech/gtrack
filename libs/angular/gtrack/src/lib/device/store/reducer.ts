// eslint:disable:only-arrow-functions no-small-switch
import { ActionTypes } from './actions';

import { DeviceAction } from '.';
import { State } from './state';

export const initialState: State = {
  heading: undefined,
};

export function reducer(state = initialState, action: DeviceAction): State {
  switch (action.type) {
    case ActionTypes.Reset:
      return initialState;

    case ActionTypes.SetHeading:
      return {
        ...state,
        heading: action.heading,
      };

    default:
      return state;
  }
}
