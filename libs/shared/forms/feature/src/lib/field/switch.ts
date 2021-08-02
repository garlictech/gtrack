import { Field, FieldOptions } from './field';

type _OnChangeType = () => void;

export interface SwitchFieldOptions extends FieldOptions<boolean> {
  readonly onChange?: _OnChangeType;
}

export class SwitchField extends Field<boolean> {
  constructor(options: SwitchFieldOptions) {
    super(options);
    this.controlType = 'switch';
  }
}
