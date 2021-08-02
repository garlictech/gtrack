import { TextboxField, TextboxFieldOptions } from './textbox';

export interface TextareaFieldOptions extends TextboxFieldOptions {
  rows?: number;
  onKeyDown?: any;
}

export class TextareaField
  extends TextboxField
  implements TextareaFieldOptions {
  rows: number;

  constructor(options: TextareaFieldOptions) {
    super(options);
    this.rows = options.rows || 6;
    this.controlType = 'textarea';
  }
}
