import { createAction, props } from '@ngrx/store';
import { CurrentActivity } from '../types';
import { featureName } from './state';
import { GeoPosition } from '@bit/garlictech.angular.gtrack.current-geolocation';
import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';

export const startActivity = createAction(
  `${featureName} Start an activity`,
  props<{ currentActivity: CurrentActivity }>()
);

export const startMoving = createAction(`${featureName} Start moving`);

export const pauseMoving = createAction(`${featureName} Pause moving`);

export const stopCurrentActivity = createAction(
  `${featureName} Stop the current activity`
);

export const resetCurrentActivity = createAction(
  `${featureName} Reset the current activity`
);

export const updateRecordedPositions = createAction(
  `${featureName} Update the recorded route positions`,
  props<{ newPositions: GeoPosition[] }>()
);

export const updatePassedPois = createAction(
  `${featureName} Update the passed pois`,
  props<{ pois: Poi[] }>()
);

export const setNextPoiToPass = createAction(
  `${featureName} Set next poi to pass`,
  props<{ poi: Poi }>()
);
