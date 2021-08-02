import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SubscriptionPlanComponent } from './components/subscription-plan/subscription-plan.component';
import { InAppPurchaseStoreModule } from './store';

@NgModule({
  imports: [CommonModule, IonicModule, InAppPurchaseStoreModule],
  exports: [SubscriptionPlanComponent],
  declarations: [SubscriptionPlanComponent],
})
export class InAppPurchaseModule {}
