import { environment as commonEnvironment } from '@bit/garlictech.angular.gtrack.environment/environment.staging';
import { commonAdminEnvironment } from './common-admin-environment';
import { Environment } from './ienvironment';

export const environment: Environment = {
  ...commonEnvironment,
  ...commonAdminEnvironment,
};

environment.authentication.cognito.userPoolClientId =
  '79b85n402cd9kb297fvc25al51';
environment.authentication.cognito.scope = [
  'email',
  'profile',
  'openid',
  'aws.cognito.signin.user.admin',
];
