import { Field, FieldOptions } from './field';

export interface SectionFieldOptions extends FieldOptions<string> {
  embeddedForm: any;
}

export class SectionField extends Field<any> {
  embeddedForm: FieldOptions<any>[];

  constructor(options: SectionFieldOptions) {
    super(options);
    this.controlType = 'section';
    this.embeddedForm = { ...options.embeddedForm };
  }
}
