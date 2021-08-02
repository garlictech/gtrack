import { TemplateRef } from '@angular/core';
import { Field, FieldOptions } from './field';

export interface TemplateFieldOptions extends FieldOptions<string> {
  templateRef: TemplateRef<any>;
}

export class TemplateField extends Field<string> {
  templateRef: TemplateRef<any>;

  constructor(options: TemplateFieldOptions) {
    super(options);
    this.templateRef = options.templateRef;
    this.controlType = 'template';
  }
}
