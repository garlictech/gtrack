import { Component } from '@angular/core';

@Component({
  selector: 'gtrack-ionic-content',
  template: `
    <div class="h-screen">
      <div class="h-full">
        <div class="gtrack-screen-padding h-full top-padding">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./ionic-content.scss'],
})
export class IonicContentComponent {}
