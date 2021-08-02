import * as fp from 'lodash/fp';
import * as E from 'fp-ts/lib/Either';
import { EMPTY, Observable, timer } from 'rxjs';
import {
  concatMap,
  expand,
  map,
  switchMap,
  take,
  toArray,
} from 'rxjs/operators';
import { flow } from 'fp-ts/lib/function';

export function multipleGet<ITEM>({
  stringifiedData,
  queryFv,
  itemsPath,
  unprocessedPath,
}: {
  stringifiedData: string;
  queryFv: (variables: Record<string, unknown>) => Observable<any>;
  itemsPath: string;
  unprocessedPath: string;
}): Observable<E.Either<unknown, ITEM[]>> {
  const args = { ids: JSON.parse(stringifiedData) as string[] };
  const maxBackoffComponent = 5;

  const processItems = fp.flow(fp.get(itemsPath), fp.filter(fp.isObject));

  const processUnprocessedItems = fp.flow(
    fp.get(unprocessedPath),
    fp.map('id')
  );

  const query = (queryArgs: Record<string, unknown>, backoffExponent = 0) =>
    queryFv(queryArgs).pipe(
      map(result => ({
        items: (processItems(result) as unknown) as ITEM[],
        unprocessed:
          backoffExponent >= maxBackoffComponent
            ? []
            : (processUnprocessedItems(result) as string[]),
        nextBackoffExponent: backoffExponent + 1,
      }))
    );

  return query(args).pipe(
    expand(({ unprocessed, nextBackoffExponent }) =>
      fp.isEmpty(unprocessed)
        ? EMPTY
        : timer(200 * 2 ** nextBackoffExponent).pipe(
            take(1),
            switchMap(() => query({ ids: unprocessed }, nextBackoffExponent))
          )
    ),
    concatMap(({ items }) => items),
    toArray(),
    map(E.fromNullable(() => new Error('Unknown error during multipleGet')))
  );
}

export function multipleCreate<CREATE_ITEM, ITEM>({
  stringifiedData,
  queryFv,
  itemsPath,
}: {
  stringifiedData: string;
  queryFv: (variables: Record<string, unknown>) => Observable<any>;
  itemsPath: string;
}): Observable<E.Either<unknown, ITEM[]>> {
  const args = { input: JSON.parse(stringifiedData) as CREATE_ITEM[] };

  return queryFv(args).pipe(
    map(
      flow(fp.get(itemsPath), result =>
        fp.isArray(result)
          ? E.right(result)
          : E.left(new Error('Unknown error during multipleCreate'))
      )
    )
  );
}
