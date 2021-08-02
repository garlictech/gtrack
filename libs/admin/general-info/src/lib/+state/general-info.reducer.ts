import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as GeneralInfoActions from './general-info.actions';
import { GeneralInfoEntity } from './general-info.models';

export const GENERAL_INFO_FEATURE_KEY = 'generalInfo';

export interface State extends EntityState<GeneralInfoEntity> {
  selectedId?: string | number; // which GeneralInfo record has been selected
  loaded: boolean; // has the GeneralInfo list been loaded
  error?: string | null; // last known error (if any)
}

export interface GeneralInfoPartialState {
  readonly [GENERAL_INFO_FEATURE_KEY]: State;
}

export const generalInfoAdapter: EntityAdapter<GeneralInfoEntity> = createEntityAdapter<GeneralInfoEntity>();

export const initialState: State = generalInfoAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const generalInfoReducer = createReducer(
  initialState,
  on(GeneralInfoActions.init, state => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(GeneralInfoActions.loadGeneralInfoSuccess, (state, { generalInfo }) =>
    generalInfoAdapter.setAll(generalInfo, { ...state, loaded: true })
  ),
  on(GeneralInfoActions.loadGeneralInfoFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return generalInfoReducer(state, action);
}
