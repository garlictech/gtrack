import { environment as baseEnvironment } from './environment.staging';

export const environment = {
  ...baseEnvironment,
  production: false,
  hmr: true,
};
