import { AfterViewInit, Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { RangeSliderComponent as NativeSliderComponent } from '@gtrack/shared/forms/feature';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,

  useExisting: forwardRef(() => RangeSliderComponent),

  multi: true,
};

interface RangeValue {
  lower?: number;
  upper?: number;
}

@Component({
  selector: 'gtrack-form-range-slider',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class RangeSliderComponent
  extends NativeSliderComponent
  implements AfterViewInit {
  valueObject: RangeValue = {};
  

  constructor() {
    super();

    this.doChange = () => {
      this.writeValue([this.valueObject.lower, this.valueObject.upper]);

      super.doChange();
    };
  }

  ngAfterViewInit(): void {
    this.valueObject = {
      lower: this.value[0],
      upper: this.value[1],
    };
  }
}
