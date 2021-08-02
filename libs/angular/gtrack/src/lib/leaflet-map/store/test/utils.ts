import { featureName, State } from '../state';

export const createFeatureState = ({
  mapId = 'foobar',
  featureId = 1,
  spinning = true,
} = {}): State => ({
  mapId,
  featureId,
  spinning,
});

export const createState = (stateParams?): { [featureName]: State } => ({
  [featureName]: createFeatureState(stateParams),
});
