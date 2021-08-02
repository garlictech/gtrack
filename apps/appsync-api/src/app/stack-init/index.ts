import { Handler } from 'aws-lambda';
import * as bunyan from 'bunyan';
import * as fp from 'lodash/fp';
import { AdminModel } from '../lib/admin.model';

const Logger = bunyan.createLogger({ name: 'gtrack', level: 'debug' });

export const handler: Handler = (): void => {
  const admins = [
    'zsolt@zsoltmolnar.hu',
    'laszlogabriel1@gmail.com',
    'mol.zsolt@gmail.com',
    'kcs941210@gmail.com',
    'nikolett@garlictech.com',
    'szimi7@gmail.com',
    'csaba@gtracksport.com',
  ];

  fp.flow(
    fp.map(email => ({ email, roles: ['admin'] })),
    adminData =>
      AdminModel.create(adminData, { overwrite: false }, err => {
        if (err) {
          Logger.error(
            `Admins cannot be added: ${JSON.stringify(err, null, 2)}`
          );
        } else {
          Logger.info(`Admins added: ${JSON.stringify(admins, null, 2)}`);
        }
      })
  )(admins);
};
