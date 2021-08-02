import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { Effects } from './effects';
import { featureName } from './state';

@NgModule({
  imports: [
    EffectsModule.forFeature([Effects]),
    StoreModule.forFeature(featureName, reducer),
  ],
  providers: [Effects],
})
export class RoutePlannerStoreModule {}
