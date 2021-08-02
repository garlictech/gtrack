import {
  LengthUnit,
  Customer,
  Settings,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { GtrackDefaults } from '@bit/garlictech.universal.gtrack.defaults/defaults';

export const defaultSettings: Settings = {
  averageSpeed: GtrackDefaults.averageSpeed(),
  lengthUnit: LengthUnit.metric,
};

export interface HikeSettings {
  startTime: Date;
  speed: number;
}

export interface HikeSettingsEntity extends HikeSettings {
  id: string;
}

export const hikeSettingsEntityStateAdapter = createEntityAdapter<
  HikeSettings
>();

// The whole profile state
export interface CustomerState {
  working?: boolean;
  error?: any;
  customer: Customer;
  hikeSettings: EntityState<HikeSettings>;
}

export const initialState: CustomerState = {
  working: false,
  customer: {},
  hikeSettings: hikeSettingsEntityStateAdapter.getInitialState(),
};

export const featureName = 'features.customer';
