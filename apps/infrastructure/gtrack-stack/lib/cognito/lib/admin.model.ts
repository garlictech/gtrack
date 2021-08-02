import * as dynogels from 'dynogels';
import * as Joi from 'joi';

const projectPrefix = process.env.PROJECT_PREFIX;

if (!projectPrefix) {
  throw new Error('PROJECT_PREFIX environment variable is not set');
}

const adminsSchema = {
  email: Joi.string().email().required(),
  roles: Joi.array()
    .items(Joi.string().allow(['admin', 'user']))
    .required(),
};

export const AdminModel = dynogels.define('Admins', {
  tableName: `${projectPrefix}-admins`,
  hashKey: 'email',
  timestamps: true,
  schema: adminsSchema,
});
