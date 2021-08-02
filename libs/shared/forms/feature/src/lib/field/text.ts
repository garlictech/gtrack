import { Field, FieldOptions } from './field';

export interface TextFieldOptions extends FieldOptions<string> {
  textKey: string;
}

export class TextField extends Field<string> {
  textKey: string;

  constructor(options: TextFieldOptions) {
    super(options);
    this.textKey = options.textKey;
    this.disableLabel = true;
    this.controlType = 'text';
  }
}
