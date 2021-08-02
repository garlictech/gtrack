import { Component, Input } from '@angular/core';
import { AbstractValueAccessor } from '../abstract-value-accessor/abstract-value-accessor';

@Component({
  selector: 'app-form-slider',
  template: '',
})
export class SliderComponent extends AbstractValueAccessor {
  @Input() min: any;
  @Input() max: any;
}
