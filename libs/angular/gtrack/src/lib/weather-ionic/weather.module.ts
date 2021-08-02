import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { WeatherModule as BaseModule } from '@bit/garlictech.angular.gtrack.weather';
import { WeatherInfoComponent } from './components';

@NgModule({
  imports: [BaseModule, CommonModule, AngularSvgIconModule],
  exports: [WeatherInfoComponent],
  declarations: [WeatherInfoComponent],
  providers: [],
})
export class WeatherModule {}
