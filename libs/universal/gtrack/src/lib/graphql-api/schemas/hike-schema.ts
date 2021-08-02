import { validateSchema } from '@bit/garlictech.universal.gtrack.joi-validator';
import * as Joi from 'joi';
import * as fp from 'lodash/fp';
import { CreateHikeInput, HikeData, UpdateHikeInput } from '../api/graphql';
import { routeDataSchema } from './route-schema';
import {
  genericHikingObjectSchemaFragment,
  publicationStateSchemaFragment,
  textualDescriptionSchema,
  checkpointSchema,
} from './schema-utils';

export const hikeDifficultySchema = Joi.number().min(0).max(4);

const hikeStopSchema = {
  poiId: Joi.string(),
  description: textualDescriptionSchema,
};

// CreateHikeInput
export const createHikeInputSchema = {
  location: Joi.string().required(),
  ...publicationStateSchemaFragment,
  featured: Joi.boolean().allow(null),
  rate: Joi.string().allow(null),
  offlineMap: Joi.string().allow(null),
  ...genericHikingObjectSchemaFragment,
  featuredStops: Joi.array()
    .items(Joi.object().keys(hikeStopSchema))
    .allow(null),
  checkpoints: Joi.array().items(checkpointSchema).allow(null),
  route: Joi.object().keys(routeDataSchema),
  segments: Joi.array().items(Joi.number().integer().positive()),
};

export const {
  validate: validateCreateHikeInput,
  isType: isCreateHikeInput,
} = validateSchema<CreateHikeInput>(createHikeInputSchema);

// Hike

export const hikeSchema = {
  id: Joi.string().required(),
  ...createHikeInputSchema,
};

export const { validate: validateHike, isType: isHike } = validateSchema<
  HikeData
>(hikeSchema);

// UpdateHikeInput
const optional = fp.omit(['id'], hikeSchema);

const updateHikeSchema = Joi.object({
  ...hikeSchema,
}).optionalKeys(Object.keys(optional));

export const {
  validate: validateUpdateHikeInput,
  isType: isUpdateHikeInput,
} = validateSchema<UpdateHikeInput>(updateHikeSchema);
