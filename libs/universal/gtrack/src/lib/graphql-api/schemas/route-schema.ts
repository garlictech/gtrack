import { Position } from '@turf/helpers';
import { validateSchema } from '@bit/garlictech.universal.gtrack.joi-validator';
import * as Joi from 'joi';
import {
  latitudeSchema,
  longitudeSchema,
  boundingBoxSchema,
} from './schema-utils';
import { RouteData } from '../api/graphql';

const createSchema = (isWithElevation: boolean) =>
  Joi.array()
    .items(
      Joi.array()
        .ordered(
          longitudeSchema.required(),
          latitudeSchema.required(),
          isWithElevation
            ? Joi.number().precision(8).required()
            : Joi.number().precision(8)
        )
        .length(isWithElevation ? 3 : 2)
    )
    .required()
    .min(1);

export const coordinatesSchema = createSchema(false);
export const coordinatesWithElevationSchema = createSchema(true);

export const {
  validate: validateCoordinates,
  isType: isCoordinates,
} = validateSchema<Position[]>(coordinatesSchema);

export const {
  validate: validateCoordinatesWithElevation,
  isType: isCoordinatesWithElevation,
} = validateSchema<Position[]>(coordinatesWithElevationSchema);

// RouteData
export const routeDataSchema = {
  distance: Joi.number().positive().integer(),
  uphill: Joi.number().positive().integer(),
  downhill: Joi.number().positive().integer(),
  bigBuffer: Joi.array().items(coordinatesSchema),
  smallBuffer: Joi.array().items(coordinatesSchema),
  track: coordinatesWithElevationSchema,
  averageTime: Joi.number().positive().integer(),
  score: Joi.number().positive().integer(),
  difficulty: Joi.number().positive().integer().max(5),
  bounds: Joi.object().keys(boundingBoxSchema),
  isRoundTrip: Joi.boolean(),
  poiSearchBox: Joi.object().keys(boundingBoxSchema),
};

export const {
  validate: validateRouteData,
  isType: isRouteData,
} = validateSchema<RouteData>(routeDataSchema);
