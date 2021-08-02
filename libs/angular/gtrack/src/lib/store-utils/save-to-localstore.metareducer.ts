import { ActionReducer, Action } from '@ngrx/store';
import { merge, pick } from 'lodash';
import { LocalStorageService } from '@bit/garlictech.angular.gtrack.local-storage';

export function storageMetaReducer<S, A extends Action = Action>(
  saveKeys: string[],
  localStorageKey: string,
  storageService: LocalStorageService
): any {
  let onInit = true; // after load/refresh…
  return (reducer: ActionReducer<S, A>) => {
    return (state: S, action: A): S => {
      // get the next state.
      const nextState = reducer(state, action);
      // init the application state.
      if (onInit) {
        onInit = false;
        const savedState = storageService.getObject(localStorageKey);
        return merge(nextState, savedState);
      }

      // save the next state to the application storage.
      const stateToSave = pick(nextState, saveKeys);
      storageService.setObject(localStorageKey, stateToSave);

      return nextState;
    };
  };
}
