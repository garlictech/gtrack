import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects } from './effects';
import { reducer } from './reducer';
import { featureName } from './state';

@NgModule({
  imports: [
    StoreModule.forFeature(featureName, reducer),
    EffectsModule.forFeature([Effects]),
  ],
  providers: [Effects],
})
export class LeafletMapStoreModule {}
