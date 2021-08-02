import * as deviceActions from './actions';

export type DeviceAction = deviceActions.AllActions;
export * from './reducer';
export * from './selectors';
export { featureName, State } from './state';
export { deviceActions };
