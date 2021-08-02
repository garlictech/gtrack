import { GraphqlCRUDApi } from '@bit/garlictech.universal.gtrack.graphql-data';

import { Observable } from 'rxjs';

import { switchMap, mapTo } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
import { GTrackEntityCollectionDataService } from '@bit/garlictech.angular.gtrack.gtrack-data';
import { QueryParams } from '@ngrx/data';
import { foldObservableEither } from '@bit/garlictech.universal.gtrack.fp';

export class GraphqlApiServiceBase<CREATE, ENTITY extends { id: string }>
  implements GTrackEntityCollectionDataService<ENTITY> {
  constructor(private readonly api: GraphqlCRUDApi<CREATE, ENTITY>) {}

  getById(id: string): Observable<ENTITY> {
    return this.api.getById(id).pipe(switchMap(foldObservableEither));
  }

  add(input: CREATE): Observable<ENTITY> {
    return this.api.add(input).pipe(switchMap(foldObservableEither));
  }

  update(input: Update<ENTITY>): Observable<ENTITY> {
    return this.api
      .update(input.id as string, input.changes)
      .pipe(switchMap(foldObservableEither));
  }

  delete(id: string): Observable<string> {
    return this.api.delete(id).pipe(switchMap(foldObservableEither), mapTo(id));
  }

  getWithQuery(query: QueryParams | string): Observable<ENTITY[]> {
    if (
      typeof query === 'string' ||
      typeof query?.action !== 'string' ||
      typeof query?.stringifiedData !== 'string'
    ) {
      throw 'Cannot accept such parameter';
    } else {
      return this.api
        .getWithQuery({
          action: query.action,
          stringifiedData: query.stringifiedData,
        })
        .pipe(switchMap(foldObservableEither));
    }
  }

  getAll(): Observable<ENTITY[]> {
    throw "Don't use this operation";
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  upsert(_upsert: ENTITY): Observable<ENTITY> {
    throw "Don't use this operation";
  }
}
