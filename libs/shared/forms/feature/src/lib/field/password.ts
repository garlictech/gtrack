import { TextboxField, TextboxFieldOptions } from './textbox';

export class PasswordField extends TextboxField {
  type: string;

  constructor(options: TextboxFieldOptions) {
    super(options);
    this.type = 'password';
    this.controlType = 'textbox';
  }
}
