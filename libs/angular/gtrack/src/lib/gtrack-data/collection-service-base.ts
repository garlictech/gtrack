import * as E from 'fp-ts/lib/Either';
import { Injector } from '@angular/core';
import * as routerSelectors from '@bit/garlictech.angular.gtrack.router/store/selectors';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
  QueryParams,
} from '@ngrx/data';
import { Store } from '@ngrx/store';

import * as fp from 'lodash/fp';
import { forkJoin, Observable, throwError, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import {
  resolveByMultipleKeys,
  createMultipleItems,
  upsertMultipleItems,
  Update,
  updateMultipleItems,
} from '@bit/garlictech.universal.gtrack.graphql-data';

export class CollectionServiceBase<
  CREATE,
  OUTPUT
  > extends EntityCollectionServiceBase<OUTPUT> {
  private _store: Store;

  constructor(collectionName: string, _injector: Injector) {
    super(
      collectionName,
      _injector.get<EntityCollectionServiceElementsFactory>(
        EntityCollectionServiceElementsFactory
      )
    );

    this._store = _injector.get<Store>(Store);
  }

  create(input: CREATE): Observable<OUTPUT> {
    return super.add(input as any);
  }

  upsertObject(input: CREATE | Update<OUTPUT>): Observable<OUTPUT> {
    return (input as any).id
      ? this.update(input as Update<OUTPUT>)
      : this.create(input as CREATE);
  }

  upsertMultipleObjects(
    input: (CREATE | Update<OUTPUT>)[]
  ): Observable<OUTPUT[]> {
    return upsertMultipleItems<CREATE, OUTPUT>(input)({
      updater: params => this.update(params).pipe(map(E.right)),
      queryExecutor: params =>
        this.getWithQuery((params as unknown) as QueryParams).pipe(
          map(E.right)
        ),
    }).pipe(switchMap(E.fold(throwError, x => of(x))));
  }

  resolveByRouteParam(keyName = 'id'): Observable<OUTPUT> {
    return this._store.select(routerSelectors.selectRouteParam, keyName).pipe(
      take(1),
      filter(id => !!id),
      switchMap(id => this.getByKey(id))
    );
  }

  resolveByMultipleKeys(keys: string[]): Observable<OUTPUT[]> {
    return this.keys$.pipe(
      take(1),
      map((keysInCache: string[]) =>

        fp.flow(

          () => ({
            keysFromCache: fp.intersection(keys, keysInCache),
            newKeys: fp.difference(keys, keysInCache),
          }),
          ({ keysFromCache, newKeys }) => [
            this.entityMap$.pipe(
              take(1),
              map(entities =>
                fp.map((key: string) => entities[key])(keysFromCache)
              )
            ),
            resolveByMultipleKeys<OUTPUT>(newKeys)(params =>
              this.getWithQuery(params as unknown as QueryParams).pipe(
                map(E.right)
              )
            ).pipe(switchMap(E.fold(throwError, of))),
          ]
        )()
      ),
      switchMap(operations => forkJoin(operations)),
      map(fp.flow(fp.flatten, fp.remove(fp.isNil))),
    );
  }

  createMultipleItems(inputs: CREATE[]): Observable<OUTPUT[]> {
    return createMultipleItems<CREATE, OUTPUT>(inputs)(params =>
      this.getWithQuery((params as unknown) as QueryParams).pipe(map(E.right))
    ).pipe(switchMap(E.fold(throwError, x => of(x))));
  }

  updateMultipleItems(inputs: Update<OUTPUT>[]): Observable<OUTPUT[]> {
    return updateMultipleItems<OUTPUT>(inputs)(params =>
      this.update(params).pipe(map(E.right))
    ).pipe(switchMap(E.fold(throwError, x => of(x))));
  }
}
