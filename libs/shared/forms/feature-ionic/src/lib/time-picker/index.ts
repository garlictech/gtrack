import { Component, forwardRef } from '@angular/core';

import { TimePickerComponent as NativeTimePickerComponent } from '@gtrack/shared/forms/feature';

import { NG_VALUE_ACCESSOR } from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,

  useExisting: forwardRef(() => TimePickerComponent),

  multi: true,
};

@Component({
  selector: 'gtrack-form-time-picker',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class TimePickerComponent extends NativeTimePickerComponent {
  writeValue(value: Date | string): void {
    this._value = new Date(value).toISOString();
  }
}
