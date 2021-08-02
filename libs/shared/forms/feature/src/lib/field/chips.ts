import { Field, FieldOptions } from './field';

export type ChipsFieldOptions = FieldOptions<string[]>;

export class ChipsField extends Field<string[]> {
  constructor(options: ChipsFieldOptions) {
    super(options);
    this.controlType = 'chips';
  }
}
