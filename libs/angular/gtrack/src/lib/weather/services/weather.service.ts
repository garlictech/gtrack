import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import {
  OpenWeatherMapForecast,
  WEATHER_CONFIG,
  WeatherConfig,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly _apiUrl: string;

  constructor(
    private readonly _http: HttpClient,
    @Inject(WEATHER_CONFIG) private readonly _config: WeatherConfig
  ) {
    this._apiUrl = 'https://api.openweathermap.org/data/2.5';
  }

  getWeather(position: Position): Observable<any> {
    return this._http.get<OpenWeatherMapForecast>(`${this._apiUrl}/forecast`, {
      params: {
        lat: position[1].toString(),
        lon: position[0].toString(),
        APIKEY: this._config.openWeatherMap.key,
        units: 'metric',
      },
    });
  }
}
