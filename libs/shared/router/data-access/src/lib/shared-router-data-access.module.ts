import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { CustomSerializer, Effects } from './+state/custom-serializer';
import { featureName } from './+state/state';

export const routerModuleConfig = {
  serializer: CustomSerializer,
  stateKey: featureName,
};

@NgModule({
  imports: [
    EffectsModule.forFeature([Effects]),
    StoreModule.forFeature(featureName, routerReducer),
  ],
  exports: [],
})
export class SharedRouterDataAccessModule {}
