import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects } from './+state/effects';
import { reducer, metaReducers } from './+state/reducer';
import { featureName } from './+state/state';
import { SharedRouterDataAccessModule } from '@gtrack/shared/router/data-access';

@NgModule({
  imports: [
    SharedRouterDataAccessModule,
    StoreModule.forFeature(featureName, reducer),
    EffectsModule.forFeature([Effects]),
  ],
  providers: [Effects],
})
export class SharedAuthenticationDataAccessModule {}
