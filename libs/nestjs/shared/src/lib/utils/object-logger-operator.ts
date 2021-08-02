import { Logger } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { MonoTypeOperatorFunction } from 'rxjs';

export const objectLogger = <T>(text: string): MonoTypeOperatorFunction<T> =>
  tap(x => Logger.debug(`${text}: ${JSON.stringify(x, null, 2)}`));
