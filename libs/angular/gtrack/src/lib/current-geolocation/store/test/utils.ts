import { CurrentGeolocationState, featureName } from '../state';

export const createFeatureState = ({
  // eslint:disable-next-line:no-unnecessary-initializer
  currentLocation = undefined,
  tracking = false,
} = {}): CurrentGeolocationState => ({
  currentLocation,
  tracking,
});

export const createState = (
  stateParams?
): { [featureName]: CurrentGeolocationState } => ({
  [featureName]: createFeatureState(stateParams),
});
