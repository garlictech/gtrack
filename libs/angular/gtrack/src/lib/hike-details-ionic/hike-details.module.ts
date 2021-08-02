import { SharedGenericUiFeatureIonicModule } from '@gtrack/shared/generic-ui/feature-ionic';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AstronomyModule } from '@bit/garlictech.angular.gtrack.astronomy';
import { HikeDetailsModule as BaseHikeDetailsModule } from '@bit/garlictech.angular.gtrack.hike-details';
import { HikeSettingsModule } from '@bit/garlictech.angular.gtrack.hike-settings';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils';
import { WeatherModule as BaseWeatherModule } from '@bit/garlictech.angular.gtrack.weather';
import { GalleryComponentModule } from '@bit/garlictech.angular.gtrack.images-ionic';
import { TimelineComponentModule } from '@bit/garlictech.angular.gtrack.timeline-ionic';
import { WeatherModule } from '@bit/garlictech.angular.gtrack.weather';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HikeDetailsComponent } from './components/hike-details/hike-details.component';
import { HikeMapComponent } from './components/hike-map';
import { ReverseHikeButtonComponent } from './components/reverse-hike-button';
import { TrailBoxComponentModule } from './components/trail-box';
import { TrailBoxComponent } from './components/trail-box/trail-box.component';
import { PoiModule } from '@bit/garlictech.angular.gtrack.poi';
import {
  HikeStopTypesModule,
  HikeStopTitlesModule,
} from '@bit/garlictech.angular.gtrack.hike-stops';
import { ImageModule } from '@bit/garlictech.angular.gtrack.image';
import { HikeStopsStoreModule } from '../hike-stops/store/hike-stops-store.module';
import { TitledSectionComponentModule } from './components/titled-section/titled-section.component';
import { HikeDataBadgesComponentModule } from './components/hike-data-badges/hike-data-badges.component';
import { SharedGenericUiUiIonicModule } from '@gtrack/shared/generic-ui/ui-ionic';
import { SharedLocalizationUiAngularModule } from 'libs/shared/localization/ui-angular/src';


const COMPONENTS = [
  HikeDetailsComponent,
  HikeMapComponent,
  ReverseHikeButtonComponent,
];

@NgModule({
  imports: [
    IonicModule,
    AstronomyModule,
    HikeStopsStoreModule,
    BaseHikeDetailsModule,
    BaseWeatherModule,
    CommonModule,
    IonicModule,
    HikeSettingsModule,
    ReactiveFormsModule,
    HikeStopTypesModule,
    RouterModule,
    TranslateModule,
    SharedGenericUiFeatureIonicModule,
    UtilsModule,
    WeatherModule,
    TimelineComponentModule,
    PoiModule,
    ImageModule,
    HikeDataBadgesComponentModule,
    HikeStopTitlesModule,
    GalleryComponentModule,
    TrailBoxComponentModule,
    TitledSectionComponentModule,
    SharedGenericUiUiIonicModule,
    SharedLocalizationUiAngularModule
  ],
  exports: [...COMPONENTS, TrailBoxComponent],
  declarations: [...COMPONENTS],
})
export class HikeDetailsModule {}
