import { Environment as CommonEnvironment } from '@bit/garlictech.angular.gtrack.environment/ienvironment';

export interface Environment extends CommonEnvironment {
  mapillary: {
    clientID: string;
  };

  flickr: {
    apiKey: string;
    secret: string;
  };

  googlePhotoLimit: number;

  graphhopper: {
    apiKey: string;
  };
}
