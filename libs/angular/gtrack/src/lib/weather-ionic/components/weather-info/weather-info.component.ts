import { Component } from '@angular/core';
import { WeatherInfoComponent as BaseComponent } from '@bit/garlictech.angular.gtrack.weather/components';

@Component({
  selector: 'gtrack-weather-info',
  templateUrl: './weather-info.component.html',
  styleUrls: ['./weather-info.component.scss'],
})
export class WeatherInfoComponent extends BaseComponent {}
