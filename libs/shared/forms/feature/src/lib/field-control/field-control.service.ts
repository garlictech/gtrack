import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { forEach as _forEach } from 'lodash';
import { FieldBase } from '../field/field';
import { GroupField } from '../field/group';
import * as fp from 'lodash/fp';

export interface FormInstance {
  form: FormGroup;
  fields: (FieldBase | GroupField)[];
}

@Injectable({ providedIn: 'root' })
export class FieldControlService {
  toFormGroup(
    fields: Record<string, FieldBase | GroupField>,
    data: Record<string, unknown>
  ): FormInstance {
    const group: Record<string, AbstractControl> = {};
    const formFields: (FieldBase | GroupField)[] = [];

    _forEach(fields, (field, key) => {
      if (field.controlType === 'group' && field instanceof GroupField) {
        const embeddedForm: FormInstance[] = fp.map(
          (arrayValue: Record<string, unknown>) =>
            this.toFormGroup((field as GroupField).embeddedForm, arrayValue)
        )(data[key] as Record<string, unknown>[]);

        group[key] = new FormArray(embeddedForm.map(form => form.form));
      } else if (field.controlType === 'section') {
        const embeddedForm: FormInstance = this.toFormGroup(
          (field as GroupField).embeddedForm,
          data[key] as Record<string, unknown>
        );
        group[key] = embeddedForm.form;
      } else {
        group[key] = new FormControl(
          data[key] || field.defaultValue,
          field.validators
        );
      }

      if ((field.disabled || field.disableOnTrue) && data[key]) {
        field.disabled = true;
      }

      formFields.push({ ...field, key });
    });

    return { form: new FormGroup(group), fields: formFields };
  }
}
