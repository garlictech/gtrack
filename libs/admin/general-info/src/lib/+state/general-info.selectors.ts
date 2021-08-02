import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  GENERAL_INFO_FEATURE_KEY,
  State,
  GeneralInfoPartialState,
  generalInfoAdapter,
} from './general-info.reducer';

// Lookup the 'GeneralInfo' feature state managed by NgRx
export const getGeneralInfoState = createFeatureSelector<
  GeneralInfoPartialState,
  State
>(GENERAL_INFO_FEATURE_KEY);

const { selectAll, selectEntities } = generalInfoAdapter.getSelectors();

export const getGeneralInfoLoaded = createSelector(
  getGeneralInfoState,
  (state: State) => state.loaded
);

export const getGeneralInfoError = createSelector(
  getGeneralInfoState,
  (state: State) => state.error
);

export const getAllGeneralInfo = createSelector(
  getGeneralInfoState,
  (state: State) => selectAll(state)
);

export const getGeneralInfoEntities = createSelector(
  getGeneralInfoState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getGeneralInfoState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getGeneralInfoEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
