import { Component, Input } from '@angular/core';

@Component({
  selector: 'gtrack-wind-direction-icon',
  templateUrl: './wind-direction-icon.component.html',
})
export class WindDirectionIconComponent {
  @Input() deg: number;

  @Input() width: number;

  @Input() height: number;

  constructor() {
    this.width = 18;
    this.height = 18;
  }
}
