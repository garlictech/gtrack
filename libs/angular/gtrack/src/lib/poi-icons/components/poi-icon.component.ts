import { Component, NgModule, Input, HostBinding } from '@angular/core';
import { AngularSvgIconModule, SvgIconRegistryService } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { IconDescriptor } from '@bit/garlictech.universal.gtrack.poi-icons';
import { mapSvgs } from '@bit/garlictech.universal.gtrack.map-symbols/map_symbols';
import { forIn } from 'lodash';

@Component({
  selector: 'gtrack-poi-icon',
  template: `<svg-icon *ngIf="icon" [src]="icon.url"></svg-icon>`,
})
export class PoiIconComponent {
  @Input() icon: IconDescriptor;
  @HostBinding('style.--icon-color') get color(): string {
    return this.icon?.color ?? '#ffffff';
  }
}

@NgModule({
  imports: [CommonModule, AngularSvgIconModule],
  exports: [PoiIconComponent],
  declarations: [PoiIconComponent],
})
export class PoiIconComponentModule {
  constructor(private iconReg: SvgIconRegistryService) {
    forIn(mapSvgs, (value, key) => this.iconReg.addSvg(key, value));
  }
}
