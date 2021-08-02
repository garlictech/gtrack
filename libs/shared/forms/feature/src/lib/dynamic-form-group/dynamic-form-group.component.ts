import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { forEach as _forEach } from 'lodash';
import { GroupFieldOptions } from '../field/group';

@Component({
  selector: 'app-native-form-group',
  template: '',
})
export class DynamicFormGroupComponent implements OnInit {
  @Input() controlGroup?: FormArray;
  @Input() fields?: GroupFieldOptions;
  formFields: Array<Record<string, unknown>> = [];

  ngOnInit(): void {
    if (!this.fields) {
      return;
    }

    _forEach(this.fields.embeddedForm, (field, key) => {
      this.formFields.push({ ...field, key });
    });
  }

  addItem(): void {
    if (!this.fields || !this.controlGroup) {
      return;
    }

    const group: Record<string, FormControl> = {};

    _forEach(this.fields.embeddedForm, (field, key) => {
      group[key] = new FormControl(field.defaultValue, field.validators);
    });

    this.controlGroup.insert(0, new FormGroup(group));
  }

  removeItem(index: number): void {
    this.controlGroup?.removeAt(index);
  }
}
