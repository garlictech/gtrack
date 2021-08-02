import { Component, Input, OnInit } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor/abstract-value-accessor';

@Component({
  selector: 'app-native-form-date-picker',
  template: '',
})
export class DatePickerComponent
  extends AbstractValueAccessor<Date>
  implements OnInit {
  @Input() maxDate?: Date;
  @Input() minDate?: Date;
  @Input() defaultDate?: Date;
  @Input() placeholder?: string;
  @Input() showTime = false;

  constructor() {
    super();

    this.onChange = (value?: string | Date): void => {
      this.value = typeof value === 'string' ? new Date(value) : value;
    };
  }

  ngOnInit(): void {
    this._value =
      typeof this.defaultDate === 'string'
        ? new Date(this.defaultDate)
        : this.defaultDate;
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
