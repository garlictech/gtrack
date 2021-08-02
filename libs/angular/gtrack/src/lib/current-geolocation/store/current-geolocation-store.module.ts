import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CurrentGeolocationEffects } from './effects';
import { reducer } from './reducer';
import { featureName } from './state';

@NgModule({
  imports: [
    StoreModule.forFeature(featureName, reducer),
    EffectsModule.forFeature([CurrentGeolocationEffects]),
  ],
  providers: [CurrentGeolocationEffects],
})
export class CurrentGeolocationStoreModule {}
