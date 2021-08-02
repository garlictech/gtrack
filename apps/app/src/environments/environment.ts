import { environment as baseEnvironment } from '@bit/garlictech.angular.gtrack.environment/environment';
import { Environment } from './ienvironment';

(baseEnvironment as any).authentication.google.androidClientId =
  '941049973777-qbgf9jlndh3vh96djnqjsbvb29r2c1ta.apps.googleusercontent.com';

export const environment: Environment = (baseEnvironment as unknown) as Environment;
