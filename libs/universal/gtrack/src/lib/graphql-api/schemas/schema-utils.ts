import { validateSchema } from '@bit/garlictech.universal.gtrack.joi-validator';
import { EnumValues } from 'enum-values';
import * as geoJSONValidation from 'geojson-validation';
import * as Joi from 'joi';
import { PoiSource, PublicationState } from '../api/graphql';
import { Observable } from 'rxjs';

export const textualDescriptionSchema = Joi.array().items(
  Joi.object()
    .keys({
      languageKey: Joi.string().required(),
      title: Joi.string().allow(null),
      summary: Joi.string().allow(null),
      fullDescription: Joi.string().allow(null),
      type: Joi.string().required(),
    })
    .required()
);

export const latitudeSchema = Joi.number().min(-90).max(90).precision(8);

export const longitudeSchema = Joi.number().min(-180).max(180).precision(8);

export const coordinatesSchemaFragment = {
  lon: longitudeSchema.required(),
  lat: latitudeSchema.required(),
};

export const pointSchema = Joi.object().keys({
  ...coordinatesSchemaFragment,
  elevation: Joi.number(),
});

export const checkpointSchema = Joi.alternatives().try(
  Joi.object().keys({ poiId: Joi.string().required() }),
  Joi.object().keys({ point: pointSchema.required() })
);

export const poiSourceSchema = Joi.string().allow(
  EnumValues.getValues(PoiSource)
);

export const poiSourceObjectSchema = {
  languageKey: Joi.string(),
  objectType: poiSourceSchema.required(),
  objectId: Joi.string().required(),
  url: Joi.string().uri(),
};

export const publicationStateSchema = Joi.string()
  .allow(EnumValues.getValues(PublicationState))
  .required();

export const publicationStateSchemaFragment = {
  publicationState: publicationStateSchema,
};

export const descriptionSchemaFragment = {
  description: textualDescriptionSchema.required(),
};

const geojsonValidator = geoJSONValidation.allTypes.GeoJSON;

export const genericHikingObjectSchemaFragment = {
  ...descriptionSchemaFragment,
  tags: Joi.array().items(Joi.string().required()).allow(null),
};

export const isValidGEOJsonString = (value: string): boolean => {
  try {
    JSON.parse(value);
  } catch (err) {
    return false;
  }

  return geojsonValidator(value);
};

export function multipleObjectValidator<TYPE>(
  itemSchema: Joi.SchemaLike
): (arg: unknown) => Observable<TYPE> {
  const arrayschema = Joi.array().items(itemSchema).required();

  const { validate } = validateSchema<TYPE>(arrayschema);
  return validate;
}

// BoundingBox
export const boundingBoxSchema = {
  NorthEast: pointSchema,
  SouthWest: pointSchema,
};
