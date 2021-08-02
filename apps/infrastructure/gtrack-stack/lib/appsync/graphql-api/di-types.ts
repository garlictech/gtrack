import { DI_TYPES as hikeDiTypes } from './resolvers/hike';
import { DI_TYPES as hikeGroupDiTypes } from './resolvers/hike-groups';
import { DI_TYPES as imageDiTypes } from './resolvers/image';
import { DI_TYPES as poiDiTypes } from './resolvers/poi';

export const DI_TYPES = {
  ...hikeGroupDiTypes,
  ...poiDiTypes,
  ...hikeDiTypes,
  ...imageDiTypes,
};
