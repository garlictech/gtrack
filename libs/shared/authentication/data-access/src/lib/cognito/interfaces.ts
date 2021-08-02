import { InjectionToken } from '@angular/core';

export interface CognitoConfig {
  identityPoolId: string;
  domain: string;
  region: string;
  responseType: 'token' | 'code';
  userPoolId: string;
  userPoolClientId: string;
  scope: string[];
}

export const COGNITO_CONFIG = new InjectionToken<CognitoConfig>(
  'AWS Cognito config'
);
