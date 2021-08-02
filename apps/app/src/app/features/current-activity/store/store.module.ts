import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects } from './effects';
import { reducer } from './reducer';
import { featureName } from './state';
import { LocalStorageService } from '@bit/garlictech.angular.gtrack.local-storage';
import { storageMetaReducer } from '@bit/garlictech.angular.gtrack.store-utils/save-to-localstore.metareducer';
import {
  CURRENT_ACTIVITY_STORAGE_KEYS,
  CURRENT_ACTIVITY_CONFIG_TOKEN,
} from './tokens';
import { CurrentGeolocationStoreModule } from '@bit/garlictech.angular.gtrack.current-geolocation';

export function getCurrentActivityConfig(
  saveKeys: string[],
  storageService: LocalStorageService
): any {
  return {
    metaReducers: [storageMetaReducer(saveKeys, featureName, storageService)],
  };
}

@NgModule({
  imports: [
    StoreModule.forFeature(featureName, reducer, CURRENT_ACTIVITY_CONFIG_TOKEN),
    EffectsModule.forFeature([Effects]),
    CurrentGeolocationStoreModule,
  ],
  providers: [
    Effects,
    {
      provide: CURRENT_ACTIVITY_STORAGE_KEYS,
      useValue: ['currentActivity', 'recordedCoordinates', 'allPassedPois'],
    },
    {
      provide: CURRENT_ACTIVITY_CONFIG_TOKEN,
      deps: [CURRENT_ACTIVITY_STORAGE_KEYS, LocalStorageService],
      useFactory: getCurrentActivityConfig,
    },
  ],
})
export class CurrentActivityStoreModule {}
