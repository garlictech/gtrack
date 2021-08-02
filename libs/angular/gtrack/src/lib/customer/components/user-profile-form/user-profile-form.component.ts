import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DatePickerField,
  FormDescriptor,
  MultiSelectField,
  PhoneNumberField,
  TextboxField,
} from '@gtrack/shared/forms/feature';
import { MAX_USERNAME_LENGTH } from '@bit/garlictech.angular.gtrack.gtrack-interfaces';
import {
  UpdateProfileInput,
  Profile,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { Store } from '@ngrx/store';
import { CustomerSelectors } from '../../store';
import { languages } from '../../services/customer.service';

const formFields = {
  username: new TextboxField({
    label: 'settings.profile.username',
    placeholder: 'settings.profile.username',
    required: true,
    maxLength: MAX_USERNAME_LENGTH,
  }),

  firstName: new TextboxField({
    label: 'settings.profile.firstName',
    placeholder: 'settings.profile.firstName',
    required: false,
  }),
  lastName: new TextboxField({
    label: 'settings.profile.lastName',
    placeholder: 'settings.profile.lastName',
    required: false,
  }),
  birthDate: new DatePickerField({
    label: 'settings.profile.birthDate',
    placeholder: 'settings.profile.birthDate',
    required: false,
    maxDate: new Date(),
  }),
  phone: new PhoneNumberField({
    label: 'settings.profile.phone',
    placeholder: 'settings.profile.phone',
    required: false,
  }),
  languages: new MultiSelectField({
    label: 'settings.profile.languages',
    required: false,
    selectOptions: languages,
  }),
};

@Component({
  selector: 'gtrack-common-user-profile-form',
  template: '',
})
export class UserProfileFormComponent implements OnInit {
  formDescriptor: FormDescriptor<Profile>;

  constructor(protected _store: Store) {}

  ngOnInit(): void {
    this.formDescriptor = {
      titleLabel: 'settings.profile.title',
      formDataSelector: CustomerSelectors.selectProfile,
      remoteErrorStateSelector: CustomerSelectors.selectError,
      submit: {
        translatableLabel: 'form.submit',
        submitFv: (formGroup: FormGroup) => {
          this.saveSettings(formGroup.value);
        },
      },
      fields: formFields,
    };
  }

  saveSettings(profile: UpdateProfileInput): void {
    //this._store.dispatch(LocalActions.userProfileSave({ profile }));
  }
}
