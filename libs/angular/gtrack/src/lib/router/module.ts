import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { CustomSerializer, Effects } from './store';
import { featureName } from './store/state';

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
export class RouterModule {}
