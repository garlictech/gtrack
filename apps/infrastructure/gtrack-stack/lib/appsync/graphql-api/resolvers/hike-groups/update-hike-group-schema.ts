import { validateSchema } from '@bit/garlictech.universal.gtrack.joi-validator';
import {
  hikeGroupSchema,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import * as Joi from 'joi';
import * as _ from 'lodash';

const optional = _.omit(hikeGroupSchema, ['id']);

const updateHikeGroupSchema = Joi.object({
  ...hikeGroupSchema,
}).optionalKeys(Object.keys(optional));

export const {
  validate: validateUpdateHikeGroupInput,
  isType: isUpdateHikeGroupInput,
} = validateSchema<UpdateHikeGroupInput>(updateHikeGroupSchema);
