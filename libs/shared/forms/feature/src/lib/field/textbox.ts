import { Validators } from '@angular/forms';
import { Field, FieldOptions } from './field';

export interface TextboxFieldOptions extends FieldOptions<string> {
  type?: string;
  minLength?: number;
  maxLength?: number;
}

export class TextboxField extends Field<string> {
  controlType: string;
  type: string;

  minLength?: number;
  maxLength?: number;

  constructor(options: TextboxFieldOptions) {
    super(options);
    this.controlType = 'textbox';
    this.type = options.type || 'text';
    this.minLength = options.minLength;
    this.maxLength = options.maxLength;

    if (this.minLength) {
      this.validators.push(Validators.minLength(this.minLength));
    }

    if (this.maxLength) {
      this.validators.push(Validators.maxLength(this.maxLength));
    }
  }
}
