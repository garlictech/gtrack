import { Environment as BaseEnvironment } from '@bit/garlictech.angular.gtrack.environment/ienvironment';

export type Environment = BaseEnvironment & {
  authentication: {
    google: {
      androidClientId: string;
    };
  };
};
