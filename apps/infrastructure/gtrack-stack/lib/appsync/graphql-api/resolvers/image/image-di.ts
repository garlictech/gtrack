import {
  createImageInputSchema,
  multipleObjectValidator,
  validateCreateImageInput,
  validateImage,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { ImageModel } from '@bit/garlictech.universal.gtrack.graphql-api/dynogels-models/image-model';
import 'reflect-metadata';
import { basicCrudBinder } from '../resolver-lib';
import { DI_TYPES } from './image-di-types';
import { validateUpdateImageInput } from './update-image-schema';
import { ImageFp } from '@bit/garlictech.universal.gtrack.image';

export const diBinder = (container: Container): void => {
  basicCrudBinder<CreateImageInput, UpdateImageInput, Image>({
    createSymbol: DI_TYPES.createImage,
    createMultipleSymbol: DI_TYPES.createMultipleImages,
    modelSymbol: DI_TYPES.ImageModel,
    objectValidatorSymbol: DI_TYPES.ImageValidator,
    createObjectValidatorSymbol: DI_TYPES.createImageValidator,
    createMultipleObjectValidatorSymbol: DI_TYPES.createMultipleImageValidator,
    objectModel: ImageModel,
    createObjectValidator: validateCreateImageInput,
    createMultipleObjectValidator: multipleObjectValidator<CreateImageInput>(
      createImageInputSchema
    ),
    objectValidator: validateImage,
    updateSymbol: DI_TYPES.updateImage,
    updateObjectValidatorSymbol: DI_TYPES.updateImageValidator,
    updateObjectValidator: validateUpdateImageInput,
    hashGeneratorSymbol: DI_TYPES.hashGenerator,
    hashGenerator: ImageFp.generateId,
  })(container);
};
