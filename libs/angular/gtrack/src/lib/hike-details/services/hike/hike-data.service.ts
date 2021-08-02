import { Injectable } from '@angular/core';
import { GraphqlClientService } from '@bit/garlictech.angular.gtrack.graphql-api';
import {
  GTrackEntityCollectionDataService,
  GraphqlApiServiceBase,
} from '@bit/garlictech.angular.gtrack.gtrack-data';
import { HikeData } from '@bit/garlictech.universal.gtrack.graphql-api';
import { CreateHikeInput } from '@bit/garlictech.universal.gtrack.graphql-api';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  CalculatedHike,
  createHikeApi,
  CalculatedHikeFp,
} from '@bit/garlictech.universal.gtrack.hike';
import { QueryParams } from '@ngrx/data';

import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import { pipe, flow } from 'fp-ts/lib/function';
import { foldObservableOption } from '@bit/garlictech.universal.gtrack.fp';
import { UpdateStr } from '@ngrx/entity/src/models';

const createCalculatedHike = (hikeData: HikeData) =>
  pipe(hikeData, CalculatedHikeFp.fromHikeData, foldObservableOption);

const createCalculatedHikeListFromResultArray = (hikeData: HikeData[]) =>
  pipe(
    hikeData,
    O.fromPredicate(A.isNonEmpty),
    O.chain(flow(NEA.map(CalculatedHikeFp.fromHikeData), A.sequence(O.option))),
    foldObservableOption
  );

@Injectable({
  providedIn: 'root',
})
export class HikeDataService
  implements GTrackEntityCollectionDataService<CalculatedHike> {
  name: 'HikeDataService';

  private hikeApi: GraphqlApiServiceBase<CreateHikeInput, HikeData>;

  constructor(graphqlClient: GraphqlClientService) {
    this.hikeApi = new GraphqlApiServiceBase<CreateHikeInput, HikeData>(
      createHikeApi(graphqlClient.adminClient, graphqlClient.publicClient)
    );
  }

  getById(id: string): Observable<CalculatedHike> {
    return this.hikeApi.getById(id).pipe(switchMap(createCalculatedHike));
  }

  getAll(): Observable<CalculatedHike[]> {
    return this.hikeApi
      .getAll()
      .pipe(switchMap(createCalculatedHikeListFromResultArray));
  }

  getWithQuery(query: QueryParams | string): Observable<CalculatedHike[]> {
    return this.hikeApi
      .getWithQuery(query)
      .pipe(switchMap(createCalculatedHikeListFromResultArray));
  }

  add(input: unknown): Observable<CalculatedHike> {
    return this.hikeApi
      .add(input as CreateHikeInput)
      .pipe(switchMap(createCalculatedHike));
  }

  update(input: UpdateStr<CalculatedHike>): Observable<CalculatedHike> {
    return this.hikeApi
      .update({ changes: input.changes.data as HikeData, id: input.id })
      .pipe(switchMap(updates => createCalculatedHike(updates)));
  }

  delete(id: string): Observable<string> {
    return this.hikeApi.delete(id);
  }

  upsert(upsert: CalculatedHike): Observable<CalculatedHike> {
    return this.hikeApi
      .upsert(upsert.data as HikeData)
      .pipe(switchMap(createCalculatedHike));
  }
}
