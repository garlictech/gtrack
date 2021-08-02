import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  featureName,
  hikeSettingsEntityStateAdapter,
  CustomerState,
  HikeSettings,
  HikeSettingsEntity,
} from './state';
import {
  Customer,
  Profile,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { GtrackDefaults } from '@bit/garlictech.universal.gtrack.defaults/defaults';
import { Dictionary } from '@ngrx/entity';

const selectFeature = createFeatureSelector<CustomerState>(featureName);

export const selectCustomer = createSelector(
  selectFeature,
  (state: CustomerState) => state?.customer
);

export const selectProfile = createSelector(
  selectCustomer,
  (state: Customer) => state?.profile
);

export const selectProfilePicture = createSelector(
  selectProfile,
  (state: Profile | null | undefined) => state?.picture
);

export const selectSettings = createSelector(
  selectCustomer,
  (state: Customer) => state?.settings
);

export const selectWorking = createSelector(
  selectFeature,
  (state: CustomerState) => state.working
);

export const selectError = createSelector(
  selectFeature,
  (state: CustomerState) => state.error
);

// HIKE_SETTINGS_FEATURE
export const selectHikeSettingsFeature = createSelector(
  selectFeature,
  (state: CustomerState) => state.hikeSettings
);

const {
  selectEntities: selectHikeSettingsEntities,
} = hikeSettingsEntityStateAdapter.getSelectors(selectHikeSettingsFeature);

const selectDefaultHikeSettings = createSelector(selectSettings, settings => ({
  startTime: GtrackDefaults.hikeStartTime(),
  speed: settings?.averageSpeed ?? GtrackDefaults.averageSpeed(),
}));

export const selectHikeSettingsOfOrDefault = createSelector(
  selectDefaultHikeSettings,
  selectHikeSettingsEntities,
  (
    defaultHikeSettings: HikeSettings,
    hikeSettingsEntities: Dictionary<HikeSettings>,
    props: string
  ) =>
    hikeSettingsEntities?.[props] ?? {
      speed: defaultHikeSettings.speed,
      startTime: defaultHikeSettings.startTime,
    }
);

export const selectSpeedHikeSettingsOf = createSelector(
  selectHikeSettingsOfOrDefault,
  settings => settings?.speed
);
export const selectStartDateHikeSettingsOf = createSelector(
  selectHikeSettingsOfOrDefault,
  settings => settings?.startTime
);
