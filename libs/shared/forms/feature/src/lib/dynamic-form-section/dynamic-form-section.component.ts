import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { forEach as _forEach } from 'lodash';
import { SectionFieldOptions } from '../field/section';

@Component({
  selector: 'app-native-form-section',
  template: '',
})
export class DynamicFormSectionComponent implements OnInit {
  @Input()
  controlGroup!: FormGroup;
  @Input()
  fields!: SectionFieldOptions;
  formFields: any[];

  constructor() {
    this.formFields = [];
  }

  ngOnInit(): void {
    _forEach(
      this.fields.embeddedForm,
      (field: Record<string, unknown>, key) => {
        this.formFields.push({ ...field, key });
      }
    );
  }
}
