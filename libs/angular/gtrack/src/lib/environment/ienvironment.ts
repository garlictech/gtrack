import { CognitoConfig } from '@gtrack/shared/authentication/data-access';
import { AmplifyApiConfig } from '@bit/garlictech.universal.gtrack.graphql-api';

export interface Environment {
  production: boolean;
  hmr?: boolean;
  webappServer: string;
  lambdaEndpoint: string;

  authentication: {
    facebook: {
      appId: string;
    };
    google: {
      appId: string;
    };
    cognito: CognitoConfig;
  };
  amplifyApiConfig: AmplifyApiConfig;
  googleApiKey: string;
  raven?: string;
  openWeatherMap: {
    key: string;
  };
}
