import { InjectionToken } from '@angular/core';

export interface OpenWeatherMapForecastItem {
  clouds: Record<string, unknown>;
  dt: number;
  dt_txt: string;
  main: {
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_kf: number;
    temp_max: number;
    temp_min: number;
  };
  rain: Record<string, unknown>;
  sys: Record<string, unknown>;
  weather: {
    description: string;
    icon: string;
    id: number;
    main: string;
  }[];
  wind: {
    deg: number;
    speed: number;
  };
}

export interface OpenWeatherMapForecast {
  city: {
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    id: number;
    name: string;
    population?: number;
  };
  cnt: number;
  cod: string;
  list: OpenWeatherMapForecastItem[];
  message: number;
}

export interface WeatherConfig {
  openWeatherMap: {
    key: string;
  };
}

export const defaultWeatherConfig: WeatherConfig = {
  openWeatherMap: {
    key: '',
  },
};

export const WEATHER_CONFIG = new InjectionToken<WeatherConfig>(
  'WeatherConfig'
);
