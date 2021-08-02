import { Validators } from '@angular/forms';
import { TextboxField, TextboxFieldOptions } from './textbox';

export class EmailField extends TextboxField {
  type: string;

  constructor(options: TextboxFieldOptions) {
    super(options);
    this.type = 'email';
    this.validators.push(Validators.email);
    this.controlType = 'textbox';
  }
}
