import { Component, Input } from '@angular/core';

import { AbstractValueAccessor } from '../abstract-value-accessor/abstract-value-accessor';

@Component({
  selector: 'app-form-rich-text-editor',
  template: '',
})
export class RichTextEditorComponent extends AbstractValueAccessor {
  @Input() rows: any;
}
