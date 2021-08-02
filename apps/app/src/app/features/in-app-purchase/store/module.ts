import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { featureName } from './state';

@NgModule({
  imports: [StoreModule.forFeature(featureName, reducer)],
})
export class InAppPurchaseStoreModule {}
