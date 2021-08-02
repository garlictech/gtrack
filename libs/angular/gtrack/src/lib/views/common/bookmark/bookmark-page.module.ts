import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HikesMapModule } from '@bit/garlictech.angular.gtrack.hikes-map';
import { HikeDetailsModule } from '@bit/garlictech.angular.gtrack.hike-details';
import { HikeListModule } from '@bit/garlictech.angular.gtrack.hike-list-ionic';
import { SharedLocalizationDataAccessModule } from '@gtrack/shared/localization/data-access';
import { BookmarkPageComponent } from './bookmark-page.component';

@NgModule({
  imports: [
    CommonModule,
    HikeDetailsModule,
    HikeListModule,
    HikesMapModule,
    SharedLocalizationDataAccessModule,
    RouterModule,
  ],
  exports: [BookmarkPageComponent],
  declarations: [BookmarkPageComponent],
  providers: [],
})
export class BookmarkPageModule { }
