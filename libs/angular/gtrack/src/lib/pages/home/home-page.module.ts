import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedGenericUiUiIonicModule } from '@gtrack/shared/generic-ui/ui-ionic';
import { HikeListModule } from '@bit/garlictech.angular.gtrack.hike-list-ionic';
import { SharedLocalizationDataAccessModule } from '@gtrack/shared/localization/data-access';
import {
  LocationSearchComponentModule,
  TitleSearchComponentModule,
} from '@bit/garlictech.angular.gtrack.search-ionic';
import { HomePageComponent } from './home-page.component';
import { MarketingModule } from './marketing/marketing.component';
import { IonicModule } from '@ionic/angular';
import { HikeDetailsModule } from '@bit/garlictech.angular.gtrack.hike-details';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    HikeListModule,
    SharedLocalizationDataAccessModule,
    LocationSearchComponentModule,
    TitleSearchComponentModule,
    IonicModule,
    HikeDetailsModule,
    MarketingModule,
    SharedGenericUiUiIonicModule,
    TranslateModule
  ],
  declarations: [HomePageComponent],
  exports: [HomePageComponent],
})
export class HomePageModule { }
