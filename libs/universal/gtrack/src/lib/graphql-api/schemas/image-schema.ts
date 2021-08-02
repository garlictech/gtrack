import { validateSchema } from '@bit/garlictech.universal.gtrack.joi-validator';
import * as Joi from 'joi';
import { CreateImageInput, Image } from '../api/graphql';
import {
  coordinatesSchemaFragment,
  poiSourceObjectSchema,
} from './schema-utils';

const imageInfoSchema = {
  url: Joi.string().uri().required(),
  width: Joi.number().integer().positive(),
  height: Joi.number().integer().positive(),
};

const imageLabelSchema = {
  label: Joi.string().required(),
  confidence: Joi.number().positive(),
};

export const createImageInputSchema = {
  ...coordinatesSchemaFragment,
  original: Joi.object().keys(imageInfoSchema).required(),
  card: Joi.object().keys(imageInfoSchema).required(),
  thumbnail: Joi.object().keys(imageInfoSchema).required(),
  sourceObject: Joi.object().keys(poiSourceObjectSchema).required(),
  attributions: Joi.string(),
  banned: Joi.boolean(),
  labels: Joi.array().items(imageLabelSchema),
};

export const {
  validate: validateCreateImageInput,
  isType: isCreateImageInput,
} = validateSchema<CreateImageInput>(createImageInputSchema);

// Image
export const imageSchema = {
  id: Joi.string().required(),
  ...createImageInputSchema,
};

export const { validate: validateImage, isType: isImage } = validateSchema<
  Image
>(imageSchema);
