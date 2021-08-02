import { Input, Component } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  template: '',
})
export class AbstractValueAccessor<T = any>
  implements ControlValueAccessor {
  @Input() change?: () => void;
  onChange: (arg?: T) => void;
  onTouched: () => void;
  _value?: T;

  constructor() {
    this.onChange = () => {
      // EMPTY
    };

    this.onTouched = () => {
      // EMPTY
    };
  }
  get value(): T | undefined {
    return this._value;
  }

  set value(v: T | undefined) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
      this.onTouched();
    }
  }

  doChange(): void {
    if (this.change) {
      this.change();
    }
  }

  writeValue(value?: T): void {
    this.value = value;
  }

  registerOnChange(fn: (_: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
