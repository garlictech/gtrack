import { Component, Input } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor/abstract-value-accessor';

@Component({
  selector: 'app-native-form-markdown',
  template: '',
})
export class MarkdownComponent extends AbstractValueAccessor {
  @Input() rows: any;
}
