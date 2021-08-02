import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HikeStopSetDetails } from '@bit/garlictech.universal.gtrack.hike-stops';
import { PoiIconLabelledComponentModule } from '../../../poi-icons';

@Component({
  selector: 'gtrack-hike-stop-types',
  templateUrl: './hike-stop-types.component.html',
})
export class HikeStopTypesComponent {
  @Input() stopSetDetails: HikeStopSetDetails | undefined;
}

@NgModule({
  imports: [CommonModule, PoiIconLabelledComponentModule],
  exports: [HikeStopTypesComponent],
  declarations: [HikeStopTypesComponent],
  providers: [],
})
export class HikeStopTypesModule {}
