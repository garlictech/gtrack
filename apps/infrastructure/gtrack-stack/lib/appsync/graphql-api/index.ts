import x = require('source-map-support');
x.install();
import 'reflect-metadata';

// dont't remove the line break, the above imports must be the first ones
import { Container } from 'inversify';
import { take } from 'rxjs/operators';
import { diBinder } from './di';
import { DI_TYPES } from './di-types';
import { Logger } from './logger';

export const handler: Handler = (
  event: any,
  _context: Context,
  callback
): any => {
  //dynamo.log = Logger;
  Logger.info('Registering resolvers...');
  const diContainer = new Container();
  diBinder(diContainer);
  Logger.info('Resolvers has been registered');
  Logger.info(`Event: ${JSON.stringify(event, null, 2)}`);

  try {
    const resolver = diContainer.get<Resolver>(DI_TYPES[event.field]);
    resolver
      .resolve(event.arguments)
      .pipe(take(1))
      .subscribe(
        (returnData: any) => {
          Logger.info(`Return data: ${JSON.stringify(returnData, null, 2)}`);
          callback(null, returnData);
        },
        (err: any) => {
          callback(JSON.stringify(err), null);
        }
      );
  } catch (err) {
    callback(JSON.stringify(err), null);
  }
};
