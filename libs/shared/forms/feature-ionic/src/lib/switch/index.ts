import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { SwitchComponent as NativeSwitchComponent } from '@gtrack/shared/forms/feature';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,

  useExisting: forwardRef(() => SwitchComponent),

  multi: true,
};

@Component({
  selector: 'gtrack-form-switch',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class SwitchComponent extends NativeSwitchComponent {}
