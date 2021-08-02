import { environment as commonEnvironment } from '@bit/garlictech.angular.gtrack.environment/environment.prod';
import { commonAdminEnvironment } from './common-admin-environment';
import { Environment } from './ienvironment';

export const environment: Environment = {
  ...commonEnvironment,
  ...commonAdminEnvironment,
};

environment.raven =
  'https://628e9a0b3fc8471f8bbcff98d3efb2ca@sentry.io/1209866';
environment.authentication.cognito.userPoolClientId =
  '6c4q1ah1kegcd09qm4ecs18e2m';
environment.authentication.cognito.scope = [
  'email',
  'profile',
  'openid',
  'aws.cognito.signin.user.admin',
];
