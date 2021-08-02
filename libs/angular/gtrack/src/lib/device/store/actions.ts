// eslint:disable:no-property-initializers max-classes-per-file
import { Action } from '@ngrx/store';

import { OrientationHeading } from './state';

export enum ActionTypes {
  Reset = '[Device] Reset',
  SetHeading = '[Device] Set heading',
}

export class Reset implements Action {
  readonly type = ActionTypes.Reset;
}

export class SetHeading implements Action {
  readonly type = ActionTypes.SetHeading;
  constructor(public heading: OrientationHeading) {}
}

export type AllActions = Reset | SetHeading;
