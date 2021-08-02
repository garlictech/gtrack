import { Component, Input } from '@angular/core';
import { TextualDescription } from '@gtrack/shared/localization/utils';

@Component({
  selector: 'gtrack-html-description',
  template: `
    <div
      *ngIf="localizedDescription[field]"
      [innerHTML]="truncateHTML(localizedDescription[field])"
    ></div>
  `,
})
export class HtmlDescriptionComponent {
  @Input() localizedDescription: any;
  @Input()
  field!: keyof TextualDescription;
  @Input() charlimit?: number;

  truncateHTML(text: string): string {
    if (!this.charlimit || !text || text.length <= this.charlimit) {
      return text;
    }

    const without_html = text.replace(/<(?:.|\n)*?>/gm, '');
    const shortened = without_html.substring(0, this.charlimit) + '...';
    return shortened;
  }
}
