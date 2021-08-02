import { validateSchema } from '@bit/garlictech.universal.gtrack.joi-validator';
import * as Joi from 'joi';
import { CreatePoiInput, Poi } from '../api/graphql';
import {
  coordinatesSchemaFragment,
  genericHikingObjectSchemaFragment,
  poiSourceObjectSchema,
} from './schema-utils';

// CreatePoiInput
export const createPoiInputSchema = {
  elevation: Joi.number().required(),
  types: Joi.array().items(Joi.string()),
  sourceObject: Joi.array()
    .items(Joi.object().keys(poiSourceObjectSchema))
    .required(),
  ...coordinatesSchemaFragment,
  ...genericHikingObjectSchemaFragment,
  address: Joi.string(),
  phoneNumber: Joi.string(),
  openingHours: Joi.string(),
};

export const {
  validate: validateCreatePoiInput,
  isType: isCreatePoiInput,
} = validateSchema<CreatePoiInput>(createPoiInputSchema);

// Poi
export const poiSchema = {
  id: Joi.string().required(),
  ...createPoiInputSchema,
};

export const { validate: validatePoi, isType: isPoi } = validateSchema<Poi>(
  poiSchema
);
