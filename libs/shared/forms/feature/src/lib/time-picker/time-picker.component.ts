import { Component, Input } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor/abstract-value-accessor';

@Component({
  selector: 'app-form-time-picker',
  template: '',
})
export class TimePickerComponent extends AbstractValueAccessor {
  @Input() maxDate: any;
  @Input() minDate: any;
  @Input() defaultDate: any;
  @Input() placeholder: any;

  constructor() {
    super();
    this._value =
      typeof this.defaultDate === 'string'
        ? new Date(this.defaultDate)
        : this.value;
  }
}
