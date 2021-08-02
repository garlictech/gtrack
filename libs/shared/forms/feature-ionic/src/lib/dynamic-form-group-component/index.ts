import { Component } from '@angular/core';

import { DynamicFormGroupComponent as NativeDynamicFormGroupComponent } from '@gtrack/shared/forms/feature';

@Component({
  selector: 'gtrack-form-group',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
})
export class DynamicFormGroupComponent extends NativeDynamicFormGroupComponent {
  trackByFn(index: number): number {
    return index;
  }
}
