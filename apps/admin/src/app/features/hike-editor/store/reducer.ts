// eslint:disable:only-arrow-functions no-small-switch cyclomatic-complexity
import { PublicationState } from '@bit/garlictech.universal.gtrack.graphql-api';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Action, createAction, createReducer, on } from '@ngrx/store';
import { newHikeId } from '@admin/features/hike-editor/types';
import * as fp from 'lodash/fp';
import * as fromActions from './actions';
import { State } from './state';

export const initialState: State = {
  hike: {
    id: newHikeId,
    description: [],
    publicationState: PublicationState.draft,
  },
  working: false,
  dirty: false,
};

const featureReducer = createReducer(
  initialState,

  on(fromActions.setHikeEditorDirtyState, (state: State, action) => ({
    ...state,
    dirty: action.state,
  })),

  on(fromActions.updateResolvedHike, (state: State, action) => ({
    ...state,
    dirty: true,
    resolvedHike: action.resolvedHike,
  })),

  on(fromActions.updateHike, (state: State, action) => ({
    ...state,
    dirty: true,
    hike: { ...state.hike, ...action.hikeProperties },
  })),

  on(fromActions.resetHike, () => fp.cloneDeep(initialState)),

  on(createAction(ROUTER_NAVIGATION), () => fp.cloneDeep(initialState))
);

export function reducer(state: State | undefined, action: Action): State {
  return featureReducer(state, action);
}
