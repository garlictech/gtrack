import { Component, NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDescriptor } from '@bit/garlictech.universal.gtrack.poi-icons';
import { PoiIconComponentModule } from './poi-icon.component';

@Component({
  selector: 'gtrack-poi-icon-labelled',

  template: `
    <div
      *ngIf="icon"
      class="flex flex-row justify-items-auto content-center border border-solid border-2 rounded py-1 px-2"
      [ngStyle]="{ 'border-color': icon?.color }"
    >
      <gtrack-poi-icon class="w-10 h-10 pr-2" [icon]="icon"></gtrack-poi-icon>
      <div [ngStyle]="{ color: icon?.color }">
        {{ label }}
      </div>
    </div>
  `,

  styles: [
    `
      :host {
        dislpay: inline-block;
      }
    `,
  ],
})
export class PoiIconLabelledComponent {
  @Input() icon: IconDescriptor | undefined;
  @Input() label: string | undefined;
}

@NgModule({
  imports: [CommonModule, PoiIconComponentModule],
  exports: [PoiIconLabelledComponent],
  declarations: [PoiIconLabelledComponent],
})
export class PoiIconLabelledComponentModule {}
