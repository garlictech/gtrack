import { AllActions, MessageActionTypes } from './actions';
import { LocalizationState } from './state';

const initialState: LocalizationState = {
  actualLanguage: 'en_US',
  descriptionLanguageList: [],
};

export function reducer(
  state = initialState,
  action: AllActions
): LocalizationState {
  switch (action.type) {
    case MessageActionTypes.LANGUAGE_CHANGED:
      return {
        ...state,
        actualLanguage: action.language,
      };

    case MessageActionTypes.DESCRIPTION_LANGUAGE_LIST_CHANGED:
      return {
        ...state,
        descriptionLanguageList: action.languages,
      };

    default:
      return state;
  }
}
