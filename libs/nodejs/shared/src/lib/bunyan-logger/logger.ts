import * as bunyan from 'bunyan';
export const Logger = bunyan.createLogger({ name: 'gtrack', level: 'debug' });
