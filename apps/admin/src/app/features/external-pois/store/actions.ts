// eslint:disable:no-property-initializers max-classes-per-file
import { RouteSegment } from '@bit/garlictech.universal.gtrack.route-segment';
import { createAction, props } from '@ngrx/store';

export const fetchExternalPois = createAction(
  '[ExternalPois] Fetch all external pois',
  props<{ segments: RouteSegment[] }>()
);

export const fetchExternalPoisSuccess = createAction(
  '[ExternalPois] External pois fetched successfully'
);

export const externalPoisFetchFailure = createAction(
  '[ExternalPois] Fetch failure',
  props<{ error: string }>()
);

export const fetchGTrackPois = createAction(
  '[ExternalPois] Fetch gtrack pois for a route'
);

export const fetchGTrackPoisSuccess = createAction(
  '[ExternalPois] GTrack pois fetched successfully'
);

export const gtrackPoisFetchFailure = createAction(
  '[ExternalPois] GTrack pois Fetch failure',
  props<{ error: string }>()
);
