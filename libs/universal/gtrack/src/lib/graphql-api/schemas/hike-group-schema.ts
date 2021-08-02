import { validateSchema } from '@bit/garlictech.universal.gtrack.joi-validator';
import * as Joi from 'joi';
import { CreateHikeGroupInput, HikeGroup } from '../api/graphql';
import {
  descriptionSchemaFragment,
  publicationStateSchemaFragment,
} from './schema-utils';

// CreateHikeGroupInput

export const createHikeGroupInputSchema = {
  hikeIds: Joi.array().items(Joi.string()).optional(),
  ...publicationStateSchemaFragment,
  ...descriptionSchemaFragment,
};

export const {
  validate: validateCreateHikeGroupInput,
  isType: isCreateHikeGroupInput,
} = validateSchema<CreateHikeGroupInput>(createHikeGroupInputSchema);

// HikeGroup

export const hikeGroupSchema = {
  id: Joi.string().required(),
  ...createHikeGroupInputSchema,
};

export const {
  validate: validateHikeGroup,
  isType: isHikeGroup,
} = validateSchema<HikeGroup>(hikeGroupSchema);
