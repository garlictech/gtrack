import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HikeStopSetDetails } from '@bit/garlictech.universal.gtrack.hike-stops';

@Component({
  selector: 'gtrack-hike-stop-titles',
  templateUrl: './hike-stop-titles.component.html',
})
export class HikeStopTitlesComponent {
  @Input() stopSetDetails: HikeStopSetDetails | undefined;
}

@NgModule({
  imports: [CommonModule],
  exports: [HikeStopTitlesComponent],
  declarations: [HikeStopTitlesComponent],
})
export class HikeStopTitlesModule {}
