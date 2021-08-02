import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as fp from 'lodash/fp';
import {
  filter,
  retryWhen,
  take,
  tap,
  switchMap,
  delayWhen,
} from 'rxjs/operators';
import { Observable, throwError, of, interval } from 'rxjs';

export function filterEmptyArray(): any {
  return (source: Observable<unknown>) =>
    source.pipe(filter(fp.negate(fp.isEmpty)));
}

export const buildRetryLogic = <T>({
  logger,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  retryable = (_error: unknown) => true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  retryDelayInMillisec = (_error: unknown) => 1000,
}: {
  logger?: { warn: (arg0: string) => void };
  retryable?: (error: unknown) => boolean;
  retryDelayInMillisec?: (error: unknown) => number;
}) => (source: Observable<T>): Observable<T> =>
  source.pipe(
    retryWhen(errors =>
      errors.pipe(
        tap(error =>
          logger?.warn(`Error happened... ${JSON.stringify(error, null, 2)}`)
        ),
        switchMap(error =>
          retryable(error)
            ? of(retryDelayInMillisec(error)).pipe(
                tap(delayValue => logger?.warn(`Retry in ${delayValue} ms...`)),
                delayWhen(delayValue => interval(delayValue).pipe(take(1)))
              )
            : throwError(error)
        ),
        take(3)
      )
    )
  );

export const foldObservableOption = <T>(par: O.Option<T>): Observable<T> =>
  O.fold(
    () => throwError('Invalid data'),
    (x: T) => of(x)
  )(par);

export const foldObservableEither = <T>(par: E.Either<unknown, T>): Observable<T> =>
  E.fold(
    res => throwError(res),
    (res: T) => of(res)
  )(par);
