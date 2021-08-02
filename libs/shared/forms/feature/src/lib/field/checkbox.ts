import { Field, FieldOptions } from './field';

type _OnChangeType = () => void;

export interface CheckboxFieldOptions extends FieldOptions<boolean> {
  readonly onChange?: _OnChangeType;
}

export class CheckboxField extends Field<boolean> {
  constructor(options: CheckboxFieldOptions) {
    super(options);
    this.controlType = 'checkbox';
  }
}
