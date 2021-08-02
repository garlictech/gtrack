import { Field, FieldOptions } from './field';

type _OnChangeType = () => void;

export interface SliderFieldOptions extends FieldOptions<number> {
  readonly onChange?: _OnChangeType;
  readonly min: number;
  readonly max: number;
}

export class SliderField extends Field<number> {
  controlType: string;
  min: number;
  max: number;

  protected onChange?: _OnChangeType;

  constructor(options: SliderFieldOptions) {
    super(options);
    this.controlType = 'slider';
    this.onChange = options.onChange;
    this.min = options.min;
    this.max = options.max;
  }
}
