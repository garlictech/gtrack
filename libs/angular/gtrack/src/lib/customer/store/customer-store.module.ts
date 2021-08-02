import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects } from './effects';
import { featureName } from './state';
import { reducer } from './reducer';
import { SharedAuthenticationDataAccessModule } from '@gtrack/shared/authentication/data-access';

@NgModule({
  imports: [
    SharedAuthenticationDataAccessModule,
    EffectsModule.forFeature([Effects]),
    StoreModule.forFeature(featureName, reducer),
  ],
})
export class CustomerStoreModule {}
