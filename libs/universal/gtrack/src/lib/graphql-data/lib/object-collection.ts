import * as A from 'fp-ts/lib/Array';
import { Reader } from 'fp-ts/lib/Reader';
import * as fp from 'lodash/fp';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { DataServiceActions, QueryData } from './types';
import * as E from 'fp-ts/lib/Either';
import { pipe, flow } from 'fp-ts/lib/function';

export type QueryExecutor<OUTPUT> = (
  queryParams: QueryData
) => Observable<E.Either<unknown, OUTPUT[]>>;

export type Update<OUTPUT> = Partial<OUTPUT> & { id: string };

export type Updater<DATA> = (
  data: Update<DATA>
) => Observable<E.Either<unknown, DATA>>;

type QueryExecutorReader<OUTPUT> = Reader<
  QueryExecutor<OUTPUT>,
  Observable<E.Either<unknown, OUTPUT[]>>
>;

export const createMultipleItems = <INPUT, OUTPUT>(
  input: INPUT[]
): QueryExecutorReader<OUTPUT> =>
  executeChunkedOperation<INPUT, OUTPUT>('createMultipleItems', 50)(input);

export const updateMultipleItems = <DATA>(itemsToUpdate: Update<DATA>[]) => (
  updater: Updater<DATA>
): Observable<E.Either<unknown, DATA[]>> =>
  pipe(
    from(itemsToUpdate),
    mergeMap(updater, 5),
    toArray(),
    map(A.array.sequence(E.either))
  );

export const upsertMultipleItems = <CREATE, DATA>(
  input: (CREATE | Update<DATA>)[]
) => (deps: {
  updater: Updater<DATA>;
  queryExecutor: QueryExecutor<DATA>;
}): Observable<E.Either<unknown, DATA[]>> =>
  pipe(
    input,
    fp.partition<any>(fp.has('id')),
    ([toUpdate, toCreate]: [Update<DATA>[], CREATE[]]) =>
      forkJoin([
        createMultipleItems<CREATE, DATA>(toCreate)(deps.queryExecutor),
        updateMultipleItems<DATA>(toUpdate)(deps.updater),
      ]),
    map(flow(A.array.sequence(E.either), E.map(fp.flatten)))
  );

export const resolveByMultipleKeys = <DATA>(keys: string[]) => (
  queryExecutor: QueryExecutor<DATA>
): Observable<E.Either<unknown, DATA[]>> =>
  executeChunkedOperation(
    'resolveByMultipleKeys',
    100
  )(keys)(queryExecutor).pipe(map(E.map(fp.remove(fp.isNil))));

export const executeChunkedOperation = <INPUT, OUTPUT>(
  action: DataServiceActions,
  chunkSize: number
) => (data: INPUT[]): QueryExecutorReader<OUTPUT> => queryExecutor => {
  const chunkQueries = pipe(
    data,
    fp.uniq,
    fp.chunk(chunkSize),
    fp.map((dataChunk: INPUT[]) =>
      queryExecutor({
        action,
        stringifiedData: JSON.stringify(dataChunk),
      })
    ),
    forkJoin,
    map(fp.flow(A.array.sequence(E.either), E.map<any, OUTPUT[]>(fp.flatten)))
  );

  return fp.isEmpty(data) ? of(E.right([])) : chunkQueries;
};
