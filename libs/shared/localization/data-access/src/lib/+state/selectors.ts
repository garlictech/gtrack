import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureName, LocalizationState } from './state';

const selectFeature = createFeatureSelector<LocalizationState>(featureName);

export const currentLanguage = createSelector(
  selectFeature,
  state => state.actualLanguage
);

export const descriptionLanguageList = createSelector(
  selectFeature,
  state => state.descriptionLanguageList
);

export const getLanguageSettings = createSelector(selectFeature, state => ({
  actualLanguage: state.actualLanguage ?? 'en_US',
  descriptionLanguageList: state.descriptionLanguageList ?? [],
}));
