import { Component } from '@angular/core';

import { DynamicFormFieldComponent as NativeDynamicFormFieldComponent } from '@gtrack/shared/forms/feature';

@Component({
  selector: 'gtrack-form-field',
  /*   templateUrl: './ui.html',
     styleUrls: ['./style.scss'],*/
})
export class DynamicFormFieldComponent extends NativeDynamicFormFieldComponent { }
