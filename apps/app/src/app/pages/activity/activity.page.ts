import { Component } from '@angular/core';

@Component({
  selector: 'gtrack-app-activity',
  template: `
    <ion-content fullscreen scroll-y="true" scroll-x="false">
      <gtrack-ionic-content>
        <gtrack-current-activity></gtrack-current-activity>
      </gtrack-ionic-content>
    </ion-content>
  `,
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPageComponent {}
