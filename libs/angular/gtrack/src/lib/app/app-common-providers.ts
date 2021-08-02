import { AUTH_CONFIG } from '@gtrack/shared/authentication/data-access';
import { COGNITO_CONFIG } from '@gtrack/shared/authentication/data-access';
import { CURRENT_GEOLOCATION_CONFIG } from '@bit/garlictech.angular.gtrack.current-geolocation';
import { GOOGLE_API_CONFIG } from '@bit/garlictech.angular.gtrack.google-maps';
import { APPSYNC_CONFIG_TOKEN } from '@bit/garlictech.angular.gtrack.graphql-api';
import { LOCALIZATION_CONFIG_TOKEN } from '@gtrack/shared/localization/data-access';
import { WEATHER_CONFIG } from '@bit/garlictech.angular.gtrack.weather';
import { AppPlatformConfig } from './app-common-config';
import { Environment } from '@bit/garlictech.angular.gtrack.environment';
import { SwRegistrationOptions } from '@angular/service-worker';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';

export const appCommonProviders = (
  platformConfig: AppPlatformConfig,
  environment: Environment
): any[] => [
  { provide: LOCALIZATION_CONFIG_TOKEN, useValue: platformConfig.language },
  {
    provide: WEATHER_CONFIG,
    useValue: {
      openWeatherMap: environment.openWeatherMap,
    },
  },
  { provide: APPSYNC_CONFIG_TOKEN, useValue: environment.amplifyApiConfig },
  {
    provide: COGNITO_CONFIG,
    useValue: environment.authentication.cognito,
  },
  {
    provide: CURRENT_GEOLOCATION_CONFIG,
    useValue: {
      debug: false,
      interval: 3000,
      minDistance: 5,
      timeOut: 2000,
      endpoint: environment.lambdaEndpoint,
    },
  },
  {
    provide: GOOGLE_API_CONFIG,
    useValue: { apiKey: environment.googleApiKey },
  },
  { provide: AUTH_CONFIG, useValue: { apiRoot: environment.lambdaEndpoint } },
  {
    provide: SwRegistrationOptions,
    useFactory: () => ({ enabled: environment.production }),
  },
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
];
