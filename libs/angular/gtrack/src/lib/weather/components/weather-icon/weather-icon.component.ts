import { Component, Input } from '@angular/core';

@Component({
  selector: 'gtrack-weather-icon',
  templateUrl: './weather-icon.component.html',
})
export class WeatherIconComponent {
  @Input() icon: string;
}
