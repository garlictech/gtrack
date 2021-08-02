import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChipsComponent as NativeComponent } from '@gtrack/shared/forms/feature';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,

  useExisting: forwardRef(() => ChipsComponent),

  multi: true,
};

@Component({
  selector: 'gtrack-form-chips',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class ChipsComponent extends NativeComponent {}
