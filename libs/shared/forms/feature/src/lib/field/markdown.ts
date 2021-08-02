import { TextareaField, TextareaFieldOptions } from './textarea';

export class MarkdownField
  extends TextareaField
  implements TextareaFieldOptions {
  constructor(options: TextareaFieldOptions) {
    super(options);
    this.controlType = 'markdown';
  }
}
