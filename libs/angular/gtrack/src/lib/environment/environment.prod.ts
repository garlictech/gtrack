import amplifyConfig from '@bit/garlictech.universal.gtrack.config/amplify/amplify-config-master';
import { Environment } from './ienvironment';
import { AmplifyApiConfig } from '@bit/garlictech.universal.gtrack.graphql-api';

const userPoolClientId = '3g93usp0l017gjcvr0gtg87a0r';
const userPoolId = 'us-east-1_RuX4G6Hbn';

export const environment: Environment = {
  production: true,
  raven: 'https://f4fbb3b4f4cc43babc7a17860bd3ae44@sentry.io/1209861',
  webappServer: window.location.origin,
  lambdaEndpoint: amplifyConfig.aws_cloud_logic_custom[0].endpoint + '/v1',

  authentication: {
    facebook: { appId: '1588778658079061' },
    google: {
      appId:
        '420351620633-vm4f5929r5ej2aecvnnmkq72h36r8ufb.apps.googleusercontent.com',
    },
    cognito: {
      identityPoolId: 'us-east-1:08590c44-b6c4-4e30-a1ad-6446e732953c',
      domain: 'auth.gtracksport.com',
      region: 'us-east-1',
      responseType: 'token',
      userPoolId,
      userPoolClientId,
      scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    },
  },

  googleApiKey: 'AIzaSyDThDhXfnod4-FfACelfn9K5I5XHkntZVE',
  amplifyApiConfig: {
    ...amplifyConfig,
    aws_user_pools_id: userPoolId,
    aws_user_pools_web_client_id: userPoolClientId,
    api_key: 'da2-2i2ws7pfm5efvja5es2oi2khfm',
  } as AmplifyApiConfig,

  openWeatherMap: {
    key: 'e5a0aba93cfca3ee54c272133018df78',
  },
};
