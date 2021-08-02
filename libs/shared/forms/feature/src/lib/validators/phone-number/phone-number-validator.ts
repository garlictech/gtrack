import { AbstractControl, ValidatorFn } from '@angular/forms';
import { PhoneNumber, PhoneNumberUtil } from 'google-libphonenumber';

const validatePhoneNumber = (): ValidatorFn => {
  const phoneUtil = PhoneNumberUtil.getInstance();

  return (control: AbstractControl) => {
    try {
      const phoneNumber: PhoneNumber = phoneUtil.parse(
        control.value || String(''),
        'HU'
      );

      return !phoneUtil.isValidNumber(phoneNumber)
        ? { phoneNumber: { value: control.value } }
        : null;
    } catch (err) {
      return { phoneNumber: { value: control.value } };
    }
  };
};

export const phoneNumberValidators = [validatePhoneNumber()];
