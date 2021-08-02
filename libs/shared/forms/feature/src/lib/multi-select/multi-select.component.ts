import { Component, Input } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor/abstract-value-accessor';

@Component({
  selector: 'app-native-form-multi-select',
  template: '',
})
export class MultiSelectComponent extends AbstractValueAccessor {
  @Input() options: any;
  @Input() placeholder: any;
  @Input()
  defaultLabel!: string;
}
