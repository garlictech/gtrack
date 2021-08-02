import { hikeSchema } from '@bit/garlictech.universal.gtrack.graphql-api';
import * as dynogels from 'dynogels';

const tablePrefix = process.env.TABLE_PREFIX;

export const HikeModel = dynogels.define('Hikes', {
  tableName: `${tablePrefix}-hikes`,
  hashKey: 'id',
  timestamps: true,
  schema: {
    ...hikeSchema,
    // remove "required()" to enable autogenerating
    id: dynogels.types.uuid(),
  },
});
