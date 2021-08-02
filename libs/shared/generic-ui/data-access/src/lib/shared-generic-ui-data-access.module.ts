import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects } from './+state/effects';
import { reducer } from './+state/reducer';
import { featureName } from './+state/state';

@NgModule({
  imports: [
    EffectsModule.forFeature([Effects]),
    StoreModule.forFeature(featureName, reducer),
  ],
  providers: [Effects],
})
export class SharedGenericUiDataAccessModule {}
