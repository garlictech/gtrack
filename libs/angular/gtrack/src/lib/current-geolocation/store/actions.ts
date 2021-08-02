// eslint:disable:no-property-initializers max-classes-per-file
import { Action } from '@ngrx/store';
import { GeoPosition } from '../interfaces';

export enum CurrentGeolocationActionTypes {
  CURRENT_LOCATION_OBTAINED = '[Location API] Current Location Obtained',
  START_POSITIONING = '[Location] Start Positioning',
  END_POSITIONING = '[Location] End Positioning',
  START_BROWSER_POSITIONING = '[Location] Start browser positioning',
}

export class CurrentLocationObtained implements Action {
  readonly type = CurrentGeolocationActionTypes.CURRENT_LOCATION_OBTAINED;

  constructor(public location: GeoPosition) {}
}

export class StartPositioning {
  readonly type = CurrentGeolocationActionTypes.START_POSITIONING;
}

export class StartBrowserPositioning {
  readonly type = CurrentGeolocationActionTypes.START_BROWSER_POSITIONING;
}

export class EndPositioning {
  readonly type = CurrentGeolocationActionTypes.END_POSITIONING;
}

export type Actions =
  | CurrentLocationObtained
  | StartPositioning
  | EndPositioning;
