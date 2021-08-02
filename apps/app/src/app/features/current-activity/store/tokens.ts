import { InjectionToken } from '@angular/core';
import { StoreConfig } from '@ngrx/store/';
import { State } from './state';

export const CURRENT_ACTIVITY_STORAGE_KEYS = new InjectionToken<keyof State>(
  'CurrentActivityStorageKeys'
);
export const CURRENT_ACTIVITY_CONFIG_TOKEN = new InjectionToken<
  StoreConfig<State>
>('CurrentActivityConfigToken');
