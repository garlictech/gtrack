import {
  createPoiInputSchema,
  multipleObjectValidator,
  validateCreatePoiInput,
  validatePoi,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import 'reflect-metadata';
import { basicCrudBinder } from '../resolver-lib';
import { DI_TYPES } from './poi-di-types';
import { PoiModel } from './poi-model';
import { validateUpdatePoiInput } from './update-poi-schema';

export const diBinder = (container: Container): void => {
  basicCrudBinder<CreatePoiInput, UpdatePoiInput, Poi>({
    createSymbol: DI_TYPES.createPoi,
    createMultipleSymbol: DI_TYPES.createMultiplePois,
    updateSymbol: DI_TYPES.updatePoi,
    modelSymbol: DI_TYPES.poiModel,
    objectValidatorSymbol: DI_TYPES.poiValidator,
    createObjectValidatorSymbol: DI_TYPES.createPoiValidator,
    createMultipleObjectValidatorSymbol: DI_TYPES.createMultiplePoiValidator,
    updateObjectValidatorSymbol: DI_TYPES.updatePoiValidator,
    hashGeneratorSymbol: DI_TYPES.hashGenerator,
    objectModel: PoiModel,
    createObjectValidator: validateCreatePoiInput,
    createMultipleObjectValidator: multipleObjectValidator<CreatePoiInput>(
      createPoiInputSchema
    ),
    objectValidator: validatePoi,
    updateObjectValidator: validateUpdatePoiInput,
    hashGenerator: (poi: CreatePoiInput) => `${poi.lat}-${poi.lon}`,
  })(container);
};
