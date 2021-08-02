import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { RadioSelectComponent as NativeRadioSelectComponent } from '@gtrack/shared/forms/feature';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,

  useExisting: forwardRef(() => RadioSelectComponent),

  multi: true,
};

@Component({
  selector: 'gtrack-form-radio-select',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class RadioSelectComponent extends NativeRadioSelectComponent {
  trackByFn(_index: number, item: { value: number }): number {
    return item.value;
  }
}
