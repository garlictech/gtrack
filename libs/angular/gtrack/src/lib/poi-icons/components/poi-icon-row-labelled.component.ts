import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { SharedGenericUiDataAccessModule } from '@gtrack/shared/generic-ui/data-access';
import { IconDescriptor } from '@bit/garlictech.universal.gtrack.poi-icons';
import { PoiIconLabelledComponentModule } from './poi-icon-labelled.component';

export type IconDetails = { translatedType: string; icon: IconDescriptor };

@Component({
  selector: 'gtrack-poi-icon-row-labelled',

  template: `
    <div class="flex flex-row flex-wrap justify-center">
      <gtrack-poi-icon-labelled
        *ngFor="let iconDetail of iconDetails"
        [icon]="iconDetail?.icon"
        [label]="iconDetail?.translatedType"
      ></gtrack-poi-icon-labelled>
    </div>
  `,
})
export class PoiIconRowLabelledComponent {
  @Input() iconDetails: IconDetails;
}

@NgModule({
  imports: [
    CommonModule,
    SharedGenericUiDataAccessModule,
    PoiIconLabelledComponentModule,
  ],
  exports: [PoiIconRowLabelledComponent],
  declarations: [PoiIconRowLabelledComponent],
})
export class PoiIconRowLabelledComponentModule {}
