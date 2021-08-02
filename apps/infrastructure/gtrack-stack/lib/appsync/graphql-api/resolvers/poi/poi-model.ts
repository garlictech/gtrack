import { poiSchema } from '@bit/garlictech.universal.gtrack.graphql-api';
import * as dynogels from 'dynogels';

const tablePrefix = process.env.TABLE_PREFIX;

export const PoiModel = dynogels.define('Pois', {
  tableName: `${tablePrefix}-pois`,
  hashKey: 'id',
  timestamps: true,
  schema: poiSchema,
});
