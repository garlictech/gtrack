import { ValidatorFn, Validators } from '@angular/forms';
import { Selector } from '@ngrx/store';
import { Observable, of } from 'rxjs';

export interface FieldBase {
  disableLabel?: boolean;
  disableOnTrue?: boolean;
  disabled?: boolean;
  label?: string;
  labelParams?: Record<string, unknown>;
  key?: string;
  infoText?: string;
  required?: boolean;
  remoteErrorStateFilter?: string[];
  validators?: ValidatorFn[];
  controlType?: string;
  helpText?: string;
  title?: string;
  subTitle?: string;
  hidden?: boolean;
  hidden$?: Observable<boolean>;
  submitOnChange?: boolean;
  placeholder?: string;
  remoteErrorStateSelector?: Selector<unknown, string>;
  containerCls?: string | string[];
  inputCls?: string | string[];
  labelCls?: string | string[];
  defaultValue?: unknown;
}

export interface FieldOptions<T> extends FieldBase {
  defaultValue?: T;
  formDataSelector?: Selector<unknown, T>;
}

export class Field<T> implements FieldOptions<T> {
  disableLabel?: boolean;
  disabled?: boolean;
  disableOnTrue?: boolean;
  label: string;
  labelParams?: Record<string, unknown>;
  key?: string;
  controlType?: string;
  validators: ValidatorFn[];
  remoteErrorStateSelector?: Selector<unknown, string>;
  formDataSelector?: Selector<unknown, T>;
  remoteErrorStateFilter: string[];
  defaultValue?: T;
  helpText?: string;
  title?: string;
  subTitle?: string;
  hidden: boolean;
  hidden$: Observable<boolean>;
  required: boolean;
  submitOnChange?: boolean;
  placeholder?: string;
  containerCls: string | string[];
  inputCls: string | string[];
  labelCls: string | string[];

  constructor(options: FieldOptions<T>) {
    this.label = options.label || String('');
    this.validators = options.validators || [];
    this.remoteErrorStateSelector = options.remoteErrorStateSelector;
    this.formDataSelector = options.formDataSelector;
    this.remoteErrorStateFilter = options.remoteErrorStateFilter || [];
    this.key = options.key;
    this.defaultValue = options.defaultValue;
    this.helpText = options.helpText;
    this.title = options.title;
    this.subTitle = options.subTitle;
    this.hidden = options.hidden || false;
    this.hidden$ = options.hidden$ || of(false);
    this.required = !!options.required;
    this.submitOnChange = !!options.submitOnChange;
    this.disableLabel = !!options.disableLabel;
    this.labelParams = options.labelParams;
    this.placeholder = options.placeholder;
    this.disableOnTrue = options.disableOnTrue;
    this.disabled = options.disabled;
    this.containerCls = options.containerCls || '';
    this.inputCls = options.inputCls || '';
    this.labelCls = options.labelCls || '';

    if (options.required) {
      this.validators.unshift(Validators.required);
    }
  }
}
