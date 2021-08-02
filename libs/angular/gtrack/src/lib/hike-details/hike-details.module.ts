import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EntityDataService } from '@ngrx/data';
import { TranslateModule } from '@ngx-translate/core';
import { BookmarkComponent } from './components/bookmark';
import { ReverseHikeButtonComponent } from './components/reverse-hike-button';
import { HikeDataService } from './services';
import { CurrentGeolocationStoreModule } from '@bit/garlictech.angular.gtrack.current-geolocation';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { SharedLocalizationFeatureIonicModule } from '@gtrack/shared/localization/feature-ionic';

const COMPONENTS = [BookmarkComponent, ReverseHikeButtonComponent];

@NgModule({
  imports: [
    CurrentGeolocationStoreModule,
    SharedLocalizationFeatureIonicModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
})
export class HikeDetailsModule {
  constructor(
    entityDataService: EntityDataService,
    hikeDataService: HikeDataService
  ) {
    entityDataService.registerService<CalculatedHike>('Hike', hikeDataService);
  }
}
