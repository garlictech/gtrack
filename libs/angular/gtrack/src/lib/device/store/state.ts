export interface OrientationHeading {
  magneticHeading?: number;
  trueHeading?: number;
  headingAccuracy?: number;
}

export interface State {
  heading: OrientationHeading;
}

export const featureName = 'features.common.device';
