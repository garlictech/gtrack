import { Component, Input } from '@angular/core';

@Component({
  selector: 'gtrack-timeline-vertical-line',
  template: `
    <div
      class="border-dashed border-4 w-1 h-10 m-auto rounded-lg"
      [ngStyle]="{ 'border-color': color || '#000000' }"
    ></div>
  `,
})
export class TimelineVerticalLineComponent {
  @Input() color: string;
}
