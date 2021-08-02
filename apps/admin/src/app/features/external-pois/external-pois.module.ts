import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects, reducer } from './store';
import { featureName } from './store/state';

@NgModule({
  imports: [
    EffectsModule.forFeature([Effects]),
    StoreModule.forFeature(featureName, reducer),
  ],
  providers: [Effects],
})
export class ExternalPoisModule {}
