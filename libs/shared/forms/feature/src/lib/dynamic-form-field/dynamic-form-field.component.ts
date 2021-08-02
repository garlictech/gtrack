import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { get as _get, keys as _keys } from 'lodash';
import { EMPTY, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pluck,
} from 'rxjs/operators';
import { Field, FormDescriptor } from '../field';
import { FieldOptions } from '../field/field';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-form-field',
  template: '',
})
export class DynamicFormFieldComponent implements OnInit {
  @Input() form: FormGroup | undefined;
  @Input() field: Field<any> | undefined;
  @Input() formDescriptor: FormDescriptor | undefined;

  // eslint:disable-next-line:no-output-named-after-standard-event
  @Output() readonly submit: EventEmitter<any>;

  remoteError$: Observable<string>;
  protected _change$;

  constructor(
    private readonly _translate: TranslateService,
    private readonly _store: Store
  ) {
    this.submit = new EventEmitter<any>();
    this.remoteError$ = EMPTY;
    this._change$ = new Subject<any>();
  }

  ngOnInit(): void {
    this._change$
      .pipe(untilDestroyed(this), distinctUntilChanged(), debounceTime(500))
      .subscribe(() => this._handleChange());

    if (this.field?.remoteErrorStateSelector) {
      this.remoteError$ = this._store.pipe(
        select(this.field.remoteErrorStateSelector),
        filter(err => this.field?.remoteErrorStateFilter.indexOf(err) === -1),
        map(label =>
          label ? this._translate.instant(`form.errors.${label}`) : undefined
        )
      );
    } else if (
      this.formDescriptor &&
      this.formDescriptor.remoteErrorStateSelector
    ) {
      this.remoteError$ = this._store.pipe(
        select(this.formDescriptor.remoteErrorStateSelector),
        filter(error => !!error),
        pluck(this.field?.key as string),
        filter(
          (err: string) => this.field?.remoteErrorStateFilter.indexOf(err) === -1
        ),
        map(label =>
          label ? this._translate.instant(`form.errors.${label}`) : undefined
        )
      );
    }

    if (this.field?.formDataSelector) {
      this._store
        .pipe(
          select(this.field?.formDataSelector),
          untilDestroyed(this),
          filter(fieldData => !!fieldData)
        )
        .subscribe(fieldData => {
          const val: Record<string, unknown> = {};
          val[this.field?.key as string] = fieldData;
          this.form?.patchValue(val);
        });
    }
  }

  onChange(data: unknown): void {
    this._change$.next(data);
  }

  getOnChange(): any {
    return (): void => {
      if (
        (this.field as FieldOptions<any>).submitOnChange &&
        this.form?.valid &&
        !this.form?.pristine
      ) {
        this.formDescriptor?.submit.submitFv(this.form);
      }
    };
  }

  get labelParams(): any {
    return this.field?.labelParams || {};
  }

  get sanitizedPlaceholder(): any {
    return _get(this.field, 'placeholder', '');
  }

  get containerClasses(): any {
    const list = ['form-group'];

    if (this.field?.controlType === 'switch') {
      list.push('switch-group');
    }

    return list;
  }

  get showError(): boolean {
    const fieldObj = this._fieldObj();

    if (fieldObj) {
      return fieldObj.invalid && (fieldObj.dirty || fieldObj.touched);
    } else {
      return false;
    }
  }

  get showRemoteError(): boolean {
    const fieldObj = this._fieldObj();

    if (fieldObj) {
      return !(fieldObj.touched || fieldObj.dirty);
    } else {
      return false;
    }
  }

  get actualError(): void {
    const fieldObj = this._fieldObj();
    const errorKey = _keys(fieldObj.errors)[0];

    return errorKey
      ? this._translate.instant(`form.errors.${errorKey}`)
      : undefined;
  }

  protected _handleChange(): void {
    if (this.field?.submitOnChange) {
      this.submit.emit();
    }
  }

  private _fieldObj(): any {
    return _get(this.form, `controls[${this.field?.key}]`);
  }
}
