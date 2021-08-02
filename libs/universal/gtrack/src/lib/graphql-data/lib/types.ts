import { Observable } from 'rxjs';
import { Either } from 'fp-ts/lib/Either';

export interface QueryData {
  action: string;
  stringifiedData: string;
}

export interface GraphqlCRUDApi<
  CREATE_TYPE,
  ENTITY_TYPE extends { id: string }
> {
  add(entity: CREATE_TYPE): Observable<Either<any, ENTITY_TYPE>>;
  delete(id: string): Observable<Either<any, boolean>>;
  getById(id: string): Observable<Either<any, ENTITY_TYPE>>;
  getWithQuery(query: QueryData): Observable<Either<any, ENTITY_TYPE[]>>;
  update(
    id: string,
    update: Partial<ENTITY_TYPE>
  ): Observable<Either<any, ENTITY_TYPE>>;
  createMultipleItems(
    input: CREATE_TYPE[]
  ): Observable<Either<any, ENTITY_TYPE[]>>;
  updateMultipleItems(
    input: Partial<ENTITY_TYPE>[]
  ): Observable<Either<any, ENTITY_TYPE[]>>;
  getMultipleItemsById(ids: string[]): Observable<Either<any, ENTITY_TYPE[]>>;
}

export type DataServiceActions =
  | 'resolveByMultipleKeys'
  | 'createMultipleItems';
