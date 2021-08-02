import { InjectionToken } from '@angular/core';
import { AmplifyApiConfig } from '@bit/garlictech.universal.gtrack.graphql-api';

export const APPSYNC_CONFIG_TOKEN = new InjectionToken<AmplifyApiConfig>(
  'AWS amplify config'
);
