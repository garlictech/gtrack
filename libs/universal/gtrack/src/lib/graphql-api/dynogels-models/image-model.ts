import { imageSchema } from '@bit/garlictech.universal.gtrack.graphql-api';
import * as dynogels from 'dynogels';

const tablePrefix = process.env.TABLE_PREFIX;

export const ImageModel = dynogels.define('Images', {
  tableName: `${tablePrefix}-images`,
  hashKey: 'id',
  timestamps: true,
  schema: imageSchema,
});
