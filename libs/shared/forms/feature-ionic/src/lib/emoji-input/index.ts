import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { EmojiInputComponent as NativeEmojiInputComponent } from '@gtrack/shared/forms/feature';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,

  useExisting: forwardRef(() => EmojiInputComponent),

  multi: true,
};

@Component({
  selector: 'gtrack-form-emoji-input',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class EmojiInputComponent extends NativeEmojiInputComponent {}
