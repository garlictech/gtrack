import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects, reducer } from './store';
import { featureName } from './store/state';

@NgModule({
  imports: [
    StoreModule.forFeature(featureName, reducer),
    EffectsModule.forFeature([Effects]),
  ],
  providers: [Effects],
})
export class SearchModule {}
