import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownSelectComponent as NativeDropdownSelectComponent } from '@gtrack/shared/forms/feature';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DropdownSelectComponent),
  multi: true,
};

@Component({
  selector: 'gtrack-form-dropdown-select',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class DropdownSelectComponent extends NativeDropdownSelectComponent {}
