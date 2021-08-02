import { routes } from '@admin/app-routing.module';
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'gtrack-app-footer',
  template: `
    <div>
      <span>
        <span
          >&copy; {{ currentDate | date: 'yyyy' }}
          <a href="http://www.gtracksport.com">gTrack</a></span
        >
      </span>
    </div>
  `,
})
export class GtrackInfoComponent {
  currentDate: Date;

  constructor() {
    this.currentDate = new Date();
  }
}
@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [GtrackInfoComponent],
  declarations: [GtrackInfoComponent],
})
export class GtrackInfoModule {}
