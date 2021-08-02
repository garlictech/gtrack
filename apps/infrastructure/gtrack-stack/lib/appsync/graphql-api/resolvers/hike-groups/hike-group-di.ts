import {
  createHikeGroupInputSchema,
  multipleObjectValidator,
  validateCreateHikeGroupInput,
  validateHikeGroup,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import 'reflect-metadata';
import { v1 as uuid } from 'uuid';
import { basicCrudBinder } from '../resolver-lib';
import { DI_TYPES } from './hike-group-di-types';
import { HikeGroupModel } from './hike-group-model';
import { validateUpdateHikeGroupInput } from './update-hike-group-schema';

export const diBinder = basicCrudBinder({
  createSymbol: DI_TYPES.createHikeGroup,
  createMultipleSymbol: DI_TYPES.createMultipleHikeGroups,
  updateSymbol: DI_TYPES.updateHikeGroup,
  modelSymbol: DI_TYPES.hikeGroupModel,
  objectValidatorSymbol: DI_TYPES.hikeGroupValidator,
  createObjectValidatorSymbol: DI_TYPES.createHikeGroupValidator,
  createMultipleObjectValidatorSymbol:
    DI_TYPES.createMultipleHikeGroupValidator,
  updateObjectValidatorSymbol: DI_TYPES.updateHikeGroupValidator,
  objectModel: HikeGroupModel,
  createObjectValidator: validateCreateHikeGroupInput,
  createMultipleObjectValidator: multipleObjectValidator<CreateHikeGroupInput>(
    createHikeGroupInputSchema
  ),
  objectValidator: validateHikeGroup,
  updateObjectValidator: validateUpdateHikeGroupInput,
  hashGeneratorSymbol: DI_TYPES.hashGenerator,
  hashGenerator: () => uuid(),
});
