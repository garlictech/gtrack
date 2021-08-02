import { Field, FieldOptions } from './field';

type _OnChangeType = () => void;

export interface RangeSliderFieldOptions
  extends FieldOptions<[number, number]> {
  readonly onChange?: _OnChangeType;
  readonly min: number;
  readonly max: number;
}

export class RangeSliderField extends Field<[number, number]> {
  controlType: string;
  min: number;
  max: number;

  protected onChange?: _OnChangeType;

  constructor(options: RangeSliderFieldOptions) {
    super(options);
    this.controlType = 'rangeSlider';
    this.onChange = options.onChange;
    this.min = options.min;
    this.max = options.max;
  }
}
