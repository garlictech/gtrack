import { Field, FieldOptions } from './field';

type _OnChangeType = () => void;

export interface TimePickerFieldOptions extends FieldOptions<Date> {
  readonly onChange?: _OnChangeType;
  defaultValue?: Date;
}

export class TimePickerField extends Field<Date> {
  controlType: string;
  defaultValue?: Date;

  protected onChange?: _OnChangeType;

  constructor(options: TimePickerFieldOptions) {
    super(options);

    this.controlType = 'time';
    this.onChange = options.onChange;

    this.defaultValue = options.defaultValue || new Date();
  }
}
