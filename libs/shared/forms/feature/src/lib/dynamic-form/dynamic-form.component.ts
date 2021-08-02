import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { isFunction as _isFunction, pick as _pick } from 'lodash';
import { filter, map } from 'rxjs/operators';
import {
  FieldControlService,
  FormInstance,
} from '../field-control/field-control.service';
import { FormDescriptor } from '../field/interfaces';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

const _validateForm = (form: FormGroup) => {
  Object.keys(form.controls).forEach(field => {
    const control = form.get(field);
    if (control instanceof FormArray) {
      control.controls.forEach(x => _validateForm(x as FormGroup));
    } else if (control) {
      control.markAsTouched({ onlySelf: true });
    }
  });
};

@UntilDestroy()
@Component({
  selector: 'app-native-form',
  template: '',
})
export class DynamicFormComponent implements AfterViewInit {
  @Input() formDescriptor?: FormDescriptor;
  formInstance?: FormInstance;

  constructor(
    private readonly _fcs: FieldControlService,
    private readonly _store: Store,
    private readonly _cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    if (!this.formDescriptor) {
      return;
    }

    this.formInstance = this._fcs.toFormGroup(this.formDescriptor.fields, {});
    this._cdr.detectChanges();

    if (this.formDescriptor.formDataSelector) {
      this._store
        .pipe(
          select(this.formDescriptor.formDataSelector),
          untilDestroyed(this),
          filter(formData => !!formData && !!this.formDescriptor),
          map(formData => {
            const fieldKeys = Object.keys(
              (this.formDescriptor as FormDescriptor).fields
            );

            return _pick(formData, fieldKeys);
          })
        )
        .subscribe(formData => {
          this.formInstance = this._fcs.toFormGroup(
            (this.formDescriptor as FormDescriptor).fields,
            formData
          );
          this.formInstance.form.patchValue(formData);
          this._cdr.detectChanges();
        });
    }

    const formDataHandler = (formData$: Observable<Record<string, unknown>>) =>
      formData$
        .pipe(
          untilDestroyed(this),
          filter(formData => !!formData && !!this.formDescriptor),
          map(formData => {
            const fieldKeys = Object.keys(
              (this.formDescriptor as FormDescriptor).fields
            );

            return _pick(formData, fieldKeys);
          })
        )
        .subscribe(formData => {
          this.formInstance = this._fcs.toFormGroup(
            (this.formDescriptor as FormDescriptor).fields,
            formData
          );
          this.formInstance.form.patchValue(formData);
          this._cdr.detectChanges();
        });

    if (this.formDescriptor.formData$) {
      formDataHandler(this.formDescriptor.formData$);
    }

    if (this.formDescriptor.formDataSelector) {
      formDataHandler(this._store.select(this.formDescriptor.formDataSelector));
    }
  }

  onSubmit(e?: Event): void {
    if (e) {
      e.preventDefault();
    }

    if (!this.formInstance || !this.formDescriptor) {
      return;
    }

    if (this.formInstance.form.valid) {
      this.formDescriptor.submit.submitFv(this.formInstance.form);
    } else {
      _validateForm(this.formInstance.form);
    }
  }

  getOnSubmit(): any {
    return (): void => this.onSubmit();
  }

  resetForm(): void {
    if (!this.formDescriptor) {
      return;
    }

    this.formInstance = _isFunction(this.formDescriptor.submit.resetFv)
      ? this.formDescriptor.submit.resetFv(this.formDescriptor)
      : this._fcs.toFormGroup(this.formDescriptor.fields, {});

    this._cdr.detectChanges();
  }
}
