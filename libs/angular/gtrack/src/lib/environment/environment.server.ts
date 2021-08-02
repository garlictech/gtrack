import amplifyConfig from '@bit/garlictech.universal.gtrack.config/amplify/amplify-config-master';
import { Environment } from './ienvironment';
import { AmplifyApiConfig } from '@bit/garlictech.universal.gtrack.graphql-api';

export const environment: Environment = {
  production: false,
  webappServer: window.location.origin,
  lambdaEndpoint: amplifyConfig.aws_cloud_logic_custom[0].endpoint + '/v1',

  authentication: {
    facebook: { appId: '1588778658079061' },
    google: {
      appId:
        '941049973777-8pdbs3vi9veua8i21fbnhkmku74s00dm.apps.googleusercontent.com',
    },
    cognito: {
      identityPoolId: 'us-east-1:08590c44-b6c4-4e30-a1ad-6446e732953c',
      domain: 'gtrack.auth.us-east-1.amazoncognito.com',
      region: 'us-east-1',
      responseType: 'token',
      userPoolId: 'us-east-1_2O173W10c',
      userPoolClientId: '2rp9tv9kkprvjs7i29kckg48ds',
      scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    },
  },

  googleApiKey: 'AIzaSyD8WkvPfxI6NRC7xnNrezxeIxb7MD_zRtI',

  amplifyApiConfig: {
    ...amplifyConfig,
    aws_user_pools_id: 'us-east-1_2O173W10c',
    aws_user_pools_web_client_id: '2rp9tv9kkprvjs7i29kckg48ds',
    api_key: 'a2-cglbm7r2jffu5p6gzo2nvtfqeq',
  } as AmplifyApiConfig,

  openWeatherMap: {
    key: 'e5a0aba93cfca3ee54c272133018df78',
  },
};
