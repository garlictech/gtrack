import { Field, FieldOptions } from './field';
import { SelectOption } from './select';

export interface MultiSelectFieldOptions extends FieldOptions<string[]> {
  selectOptions: SelectOption[];
}

export class MultiSelectField
  extends Field<string[]>
  implements MultiSelectFieldOptions {
  selectOptions: SelectOption[];

  constructor(options: MultiSelectFieldOptions) {
    super(options);
    this.selectOptions = options.selectOptions || [];
    this.controlType = 'multi-select';
  }
}
