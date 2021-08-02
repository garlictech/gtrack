import { validateSchema } from '@bit/garlictech.universal.gtrack.joi-validator';
import * as Joi from 'joi';
import { Observable } from 'rxjs';

const userIdSchema: Joi.SchemaLike = {
  id: Joi.string().required(),
};

const { validate } = validateSchema<any>(userIdSchema);

export interface UserId {
  id: string;
}

export const getUserId = (rawData: unknown): Observable<UserId> =>
  validate(rawData);
