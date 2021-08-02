import { phoneNumberValidators } from '../validators/phone-number/phone-number-validator';
import { TextboxField, TextboxFieldOptions } from './textbox';

export class PhoneNumberField extends TextboxField {
  constructor(options: TextboxFieldOptions) {
    super(options);
    this.validators = this.validators?.concat(phoneNumberValidators);
    this.type = 'tel';
  }
}
