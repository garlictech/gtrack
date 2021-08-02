import { validateSchema } from '@bit/garlictech.universal.gtrack.joi-validator';
import {
  imageSchema,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import * as Joi from 'joi';
import * as _ from 'lodash';

const optional = _.pick(imageSchema, ['attributions', 'banned']);
const mandatory = _.pick(imageSchema, ['id']);

const updateImageSchema = Joi.object({
  ...optional,
  ...mandatory,
}).optionalKeys(Object.keys(optional));

export const {
  validate: validateUpdateImageInput,
  isType: isUpdateImageInput,
} = validateSchema<UpdateImageInput>(updateImageSchema);
