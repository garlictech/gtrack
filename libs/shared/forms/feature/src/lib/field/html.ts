import { Field, FieldOptions } from './field';

export interface HtmlFieldOptions extends FieldOptions<string> {
  content: string;
}

export class HtmlField extends Field<string> {
  content: string;

  constructor(options: HtmlFieldOptions) {
    super(options);
    this.controlType = 'html';
    this.content = options.content;
    this.disableLabel = true;
  }
}
