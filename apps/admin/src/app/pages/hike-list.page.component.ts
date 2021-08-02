import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { HikeListModule } from '@admin/features/hike-list';
@Component({
  selector: 'gtrack-hike-list-page',
  template: ` <gtrack-app-hike-list></gtrack-app-hike-list> `,
})
export class HikeListPageComponent {}

@NgModule({
  declarations: [HikeListPageComponent],
  imports: [CommonModule, HikeListModule],
  exports: [HikeListPageComponent],
  providers: [],
})
export class HikeListPageModule {}
