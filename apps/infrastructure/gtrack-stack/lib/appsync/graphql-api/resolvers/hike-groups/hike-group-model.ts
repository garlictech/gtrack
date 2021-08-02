import { hikeGroupSchema } from '@bit/garlictech.universal.gtrack.graphql-api';
import * as dynogels from 'dynogels';

export const HikeGroupModel = dynogels.define('HikeGroups', {
  tableName: 'gTrackHikeGroups',
  hashKey: 'id',
  timestamps: true,
  schema: {
    ...hikeGroupSchema,
    // remove "required()" to enable autogenerating
    id: dynogels.types.uuid(),
  },
});
