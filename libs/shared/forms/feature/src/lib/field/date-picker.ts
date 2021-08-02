import { Field, FieldOptions } from './field';

export interface DatePickerFieldOptions extends FieldOptions<Date> {
  maxDate?: Date;
  minDate?: Date;
  defaultDate?: Date;
  showTime?: boolean;
}

export class DatePickerField
  extends Field<Date>
  implements DatePickerFieldOptions {
  maxDate?: Date;
  minDate?: Date;
  defaultDate?: Date;

  constructor(options: DatePickerFieldOptions) {
    super(options);
    this.maxDate = options.maxDate;
    this.minDate = options.minDate;
    this.defaultDate = options.defaultDate || new Date();
    this.controlType = 'date';
  }
}
