import { Component, Input } from '@angular/core';
import {
  TextualDescription,
  TextualDescriptionType,
} from '@gtrack/shared/localization/utils';

@Component({
  selector: 'gtrack-description',
  templateUrl: './description.component.html',
})
export class DescriptionComponent {
  @Input() description!: TextualDescription[] | undefined;
  @Input() field!: keyof TextualDescription;
  @Input() charlimit?: number;
  @Input() defaultTextLabel!: string;

  constructor() {
    this.field = 'fullDescription';
  }

  isHtml(description: TextualDescription): boolean {
    return description.type === TextualDescriptionType.html;
  }
}
