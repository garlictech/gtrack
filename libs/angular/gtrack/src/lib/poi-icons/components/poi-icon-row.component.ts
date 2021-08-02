import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { SharedGenericUiDataAccessModule } from '@gtrack/shared/generic-ui/data-access';
import { PoiIconComponentModule } from './poi-icon.component';
import { IconDescriptor } from '@bit/garlictech.universal.gtrack.poi-icons';

@Component({
  selector: 'gtrack-poi-icon-row',

  template: `
    <div class="flex flex-row flex-wrap justify-center">
      <gtrack-poi-icon
        *ngFor="let icon of icons"
        [icon]="icon"
        class="m-2 inline-block h-8"
      ></gtrack-poi-icon>
    </div>
  `,
})
export class PoiIconRowComponent {
  @Input() icons: IconDescriptor[];
}

@NgModule({
  imports: [
    CommonModule,
    SharedGenericUiDataAccessModule,
    PoiIconComponentModule,
  ],
  exports: [PoiIconRowComponent],
  declarations: [PoiIconRowComponent],
})
export class PoiIconRowComponentModule {}
