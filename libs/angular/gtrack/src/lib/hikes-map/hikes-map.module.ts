import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HikesMapComponent } from './hikes-map.component';
import { GtrackMapComponentModule } from '@bit/garlictech.angular.gtrack.gtrack-map/gtrack-map.module';

@NgModule({
  declarations: [HikesMapComponent],
  imports: [CommonModule, GtrackMapComponentModule],
  exports: [HikesMapComponent],
})
export class HikesMapModule {}
