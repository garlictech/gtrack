import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { HikeStop } from '@bit/garlictech.universal.gtrack.hike-stops';

export const featureName = 'common.hikeStops';

export interface State extends EntityState<HikeStop> {
  working?: boolean;
  error?: any;
  showOnrouteMarkers: boolean;
  showOffrouteMarkers: boolean;
}

export const entityAdapters = createEntityAdapter<HikeStop>({
  selectId: h => `${h.hikeId}_${h.poi.id}`,
});
