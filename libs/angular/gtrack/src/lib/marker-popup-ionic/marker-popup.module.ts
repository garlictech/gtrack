import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils';
import { MarkerPopupComponent } from './components/marker-popup/marker-popup.component';

@NgModule({
  imports: [
    CommonModule,
    UtilsModule
  ],
  declarations: [MarkerPopupComponent],
  exports: [MarkerPopupComponent],
  entryComponents: [MarkerPopupComponent],
})
export class MarkerPopupModule { }
