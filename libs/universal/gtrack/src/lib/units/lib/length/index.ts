import { LengthUnit } from '@bit/garlictech.universal.gtrack.graphql-api';
import { Imperial } from './imperial';
import { Metric } from './metric';

export const lengthUnits = {
  [LengthUnit.imperial]: new Imperial(),
  [LengthUnit.metric]: new Metric(),
};

export { LengthUnit } from './length-unit';
export { Imperial, Metric };
