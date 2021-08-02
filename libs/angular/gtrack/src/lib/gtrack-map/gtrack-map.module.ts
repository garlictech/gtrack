import { NgModule } from '@angular/core';
import { LeafletMapComponentModule } from '@bit/garlictech.angular.gtrack.leaflet-map';
import { CommonModule } from '@angular/common';
import { GtrackLeafletControlComponentModule } from './gtrack-leaflet-control/gtrack-leaflet-control.component';
import { GtrackMapComponent } from './gtrack-map.component';

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
    LeafletMapComponentModule,
    CommonModule,
    GtrackLeafletControlComponentModule,
  ],
  exports: [GtrackMapComponent],
  declarations: [GtrackMapComponent],
  providers: [],
})
export class GtrackMapComponentModule {}
