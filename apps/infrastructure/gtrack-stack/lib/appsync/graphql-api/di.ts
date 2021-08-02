import { diBinder as hikeDiBinder } from './resolvers/hike';
import { diBinder as hikeGroupsDiBinder } from './resolvers/hike-groups';
import { diBinder as imageDiBinder } from './resolvers/image';
import { diBinder as poiDiBinder } from './resolvers/poi';

export const diBinder = (container: Container): void => {
  hikeGroupsDiBinder(container);
  poiDiBinder(container);
  hikeDiBinder(container);
  imageDiBinder(container);
};
