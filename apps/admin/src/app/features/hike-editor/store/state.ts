import { HikeData } from '@bit/garlictech.universal.gtrack.graphql-api';
import { ResolvedHikeData } from '@bit/garlictech.universal.gtrack.hike/lib/types';

export const featureName = 'admin.hike-editor';

export interface State {
  hike: Partial<HikeData>;
  resolvedHike?: ResolvedHikeData;
  working: boolean;
  failed?: boolean;
  dirty: boolean;
}
