import { TextareaField, TextareaFieldOptions } from './textarea';

export class RichTextEditorField
  extends TextareaField
  implements TextareaField {
  controlType: string;

  constructor(options: TextareaFieldOptions) {
    super(options);
    this.controlType = 'richtext';
  }
}
