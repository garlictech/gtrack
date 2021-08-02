import amplifyConfig from '@bit/garlictech.universal.gtrack.config/amplify/amplify-config-staging';
import { Environment } from './ienvironment';
import { AmplifyApiConfig } from '@bit/garlictech.universal.gtrack.graphql-api';

const userPoolClientId = '4i0vmhvjjg0kkgh0ganvu0dc80';
const userPoolId = 'us-east-1_tKwbBvakU';

export const environment: Environment = {
  production: true,
  webappServer: window.location.origin,
  lambdaEndpoint: amplifyConfig.aws_cloud_logic_custom[0].endpoint + '/v1',

  authentication: {
    facebook: { appId: '1588778658079061' },
    google: {
      appId:
        '686126282936-2jerlbi7mh5768ufr76mk2di00tg063a.apps.googleusercontent.com',
    },
    cognito: {
      identityPoolId: 'us-east-1:08590c44-b6c4-4e30-a1ad-6446e732953c',
      domain: 'gtrack-staging.auth.us-east-1.amazoncognito.com',
      region: 'us-east-1',
      responseType: 'token',
      userPoolId,
      userPoolClientId,
      scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    },
  },
  amplifyApiConfig: {
    ...amplifyConfig,
    aws_user_pools_id: userPoolId,
    aws_user_pools_web_client_id: userPoolClientId,
    api_key: 'da2-zmtb33wymrb4lkwr5m5rb43hnu',
  } as AmplifyApiConfig,

  googleApiKey: 'AIzaSyDZjCPlj3vAGrVYfimxRlcKk72F1aoAPxo',
  openWeatherMap: { key: 'e5a0aba93cfca3ee54c272133018df78' },
  raven: 'https://f4fbb3b4f4cc43babc7a17860bd3ae44@sentry.io/1209861',
};
