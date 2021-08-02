import { validateSchema } from '@bit/garlictech.universal.gtrack.joi-validator';
import {
  poiSchema,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import * as Joi from 'joi';
import * as _ from 'lodash';

const omitted = _.omit(poiSchema, ['elevation', 'lat', 'lon']);
const mandatory = _.pick(poiSchema, ['id']);

const updatePoiSchema = Joi.object({ ...omitted, ...mandatory }).optionalKeys(
  Object.keys(omitted)
);

export const {
  validate: validateUpdatePoiInput,
  isType: isUpdatePoiInput,
} = validateSchema<UpdatePoiInput>(updatePoiSchema);
