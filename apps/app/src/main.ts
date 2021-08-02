/* eslint no-console: "off" */
import '@angular/compiler';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export const awsConfig = {
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: 'us-east-1:08590c44-b6c4-4e30-a1ad-6446e732953c',

    // REQUIRED - Amazon Cognito Region
    region: 'us-east-1',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_2O173W10c',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolClientId: '2rp9tv9kkprvjs7i29kckg48ds',
    userPoolWebClientId: '2rp9tv9kkprvjs7i29kckg48ds',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    cookieStorage: {
      // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      domain: 'gtrack.auth.us-east-1.amazoncognito.com',
      // OPTIONAL - Cookie path
      path: '/',
      // OPTIONAL - Cookie expiration in days
      expires: 365,
      // OPTIONAL - Cookie secure flag
      // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
      secure: true,
    },

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    // authenticationFlowType: 'USER_PASSWORD_AUTH',
    scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
  },
};

if (environment.production) {
  enableProdMode();
}

// PubSub.configure(awsConfig);
// API.configure(awsConfig);
// Amplify.configure(awsconfig);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // eslint:disable-next-line:no-console
  .catch(err => console.log(err));

defineCustomElements(window);
