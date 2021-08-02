import { AngularSvgIconModule } from 'angular-svg-icon';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import {
  WeatherIconComponent,
  WeatherInfoComponent,
  WindDirectionIconComponent,
} from './components';
import {
  featureName,
/*   getReducers,
 */  WEATHER_REDUCER_TOKEN,
/*   WeatherEffects,
 */  WeatherSelectors,
} from './store';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
/*     EffectsModule.forFeature([WeatherEffects]),
 */    StoreModule.forFeature(featureName, WEATHER_REDUCER_TOKEN),
    AngularSvgIconModule,
  ],
  declarations: [
    WeatherInfoComponent,
    WeatherIconComponent,
    WindDirectionIconComponent,
  ],
  exports: [WeatherIconComponent, WindDirectionIconComponent],
  providers: [
    // WeatherService,
/*     WeatherEffects,
 */    WeatherSelectors,
  /*   {
      provide: WEATHER_REDUCER_TOKEN,
      useFactory: getReducers,
    }, */
  ],
})
export class WeatherModule {}
