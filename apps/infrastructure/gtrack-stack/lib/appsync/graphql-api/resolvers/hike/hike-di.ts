import {
  createHikeInputSchema,
  multipleObjectValidator,
  validateCreateHikeInput,
  validateHike,
  validateUpdateHikeInput,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { v1 as uuid } from 'uuid';
import { basicCrudBinder } from '../resolver-lib';
import { DI_TYPES } from './hike-di-types';
import { HikeModel } from './hike-model';

export const diBinder = (container: Container): void => {
  basicCrudBinder({
    createSymbol: DI_TYPES.createHike,
    createMultipleSymbol: DI_TYPES.createMultipleHikes,
    updateSymbol: DI_TYPES.updateHike,
    modelSymbol: DI_TYPES.hikeModel,
    objectValidatorSymbol: DI_TYPES.hikeValidator,
    createObjectValidatorSymbol: DI_TYPES.createHikeValidator,
    createMultipleObjectValidatorSymbol: DI_TYPES.createMultipleHikeValidator,
    updateObjectValidatorSymbol: DI_TYPES.updateHikeValidator,
    objectModel: HikeModel,
    createObjectValidator: validateCreateHikeInput,
    createMultipleObjectValidator: multipleObjectValidator<CreateHikeInput>(
      createHikeInputSchema
    ),
    updateObjectValidator: validateUpdateHikeInput,
    objectValidator: validateHike,
    hashGeneratorSymbol: DI_TYPES.hashGenerator,
    hashGenerator: () => uuid(),
  })(container);
};
