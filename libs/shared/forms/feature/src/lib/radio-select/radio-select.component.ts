import { Component, Input } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor/abstract-value-accessor';

@Component({
  selector: 'app-native-form-radio-select',
  template: '',
})
export class RadioSelectComponent extends AbstractValueAccessor {
  @Input() options: any;
}
