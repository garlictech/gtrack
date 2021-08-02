import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { QueryParams } from '@ngrx/data';

export interface GTrackEntityCollectionDataService<
  ENTITY extends { id: string }
> {
  add(entity: unknown): Observable<ENTITY>;
  delete(id: string): Observable<string>;
  getById(id: string): Observable<ENTITY>;
  getWithQuery(query: QueryParams | string): Observable<ENTITY[]>;
  update(update: Update<ENTITY>): Observable<ENTITY>;
  getAll(): Observable<ENTITY[]>;
  upsert(upsert: ENTITY): Observable<ENTITY>;
}

export type DataServiceActions =
  | 'resolveByMultipleKeys'
  | 'createMultipleItems';
