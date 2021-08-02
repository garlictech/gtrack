import { FormGroup } from '@angular/forms';
import { Selector } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormInstance } from '../field-control/field-control.service';

export type ResetFv = (formDescriptor: FormDescriptor) => FormInstance;

export type SubmitFv = (formGroup: FormGroup) => void;

export interface Submit {
  translatableLabel?: string;
  classList?: string[];
  submitFv: SubmitFv;
  resetFv?: ResetFv;
  resetOnSubmit?: boolean;
  disabled?: () => boolean;
}

export interface FormDescriptor<T = any> {
  fields: any;
  submit: Submit;
  formDataSelector?: Selector<any, T | null | undefined>;
  formData$?: Observable<T>;
  remoteErrorStateSelector?: Selector<any, any>;
  titleLabel?: string;
}
