import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DistancePipe } from './pipes/distance.pipe';
import { CustomerStoreModule } from './store/customer-store.module';

@NgModule({
  imports: [CommonModule, CustomerStoreModule],
  declarations: [DistancePipe],
  exports: [DistancePipe],
})
export class SettingsSharedGenericUiDataAccessModule {}
