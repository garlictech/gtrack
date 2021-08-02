import { Component, Input } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor/abstract-value-accessor';

@Component({
  selector: 'app-native-form-dropdown-select',
  template: '',
})
export class DropdownSelectComponent extends AbstractValueAccessor {
  @Input() options: any;
  @Input() placeholder: any;
}
