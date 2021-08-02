import { Field, FieldOptions } from './field';

export enum ESelectTypes {
  dropdown = 'dropdown',
  radio = 'radio',
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldOptions extends FieldOptions<string> {
  type?: ESelectTypes;
  selectOptions: SelectOption[];
}

export class SelectField extends Field<string> {
  type: ESelectTypes;
  selectOptions: SelectOption[];

  constructor(options: SelectFieldOptions) {
    super(options);
    this.controlType = 'select';
    this.type = options.type || ESelectTypes.dropdown;
    this.selectOptions = options.selectOptions || [];
  }
}
