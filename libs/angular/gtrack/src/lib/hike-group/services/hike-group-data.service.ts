import { Injectable } from '@angular/core';
import { GraphqlClientService } from '@bit/garlictech.angular.gtrack.graphql-api';
import { GTrackEntityCollectionDataService } from '@bit/garlictech.angular.gtrack.gtrack-data';
import {
  CreateHikeGroup,
  CreateHikeGroupInput,
  CreateHikeGroupMutationVariables,
  GetHikeGroup,
  GetHikeGroupQueryVariables,
  HikeGroup,
  ListHikeGroups,
  Maybe,
  UpdateHikeGroup,
  UpdateHikeGroupMutationVariables,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import _ from 'lodash';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HikeGroupDataService
  implements GTrackEntityCollectionDataService<HikeGroup> {
  constructor(private readonly _service: GraphqlClientService) {}

  name: 'HikeGroupDataService';

  add(input: CreateHikeGroupInput): Observable<HikeGroup> {
    const args: CreateHikeGroupMutationVariables = { input };

    return this._service.authenticatedClient
      .mutate(CreateHikeGroup, args)
      .pipe(map(response => _.get(response, 'data.createHikeGroup')));
  }

  getById(id: string): Observable<Maybe<HikeGroup>> {
    const args: GetHikeGroupQueryVariables = { id };

    return this._service.publicClient
      .query(GetHikeGroup, args)
      .pipe(map(response => _.get(response, 'data.getHikeGroup')));
  }

  update(input: { changes: any }): Observable<HikeGroup> {
    const args: UpdateHikeGroupMutationVariables = { input: input.changes };

    return this._service.authenticatedClient
      .mutate(UpdateHikeGroup, args)
      .pipe(map(response => _.get(response, 'data.updateHikeGroup')));
  }

  getAll(): Observable<HikeGroup[]> {
    return this._service.authenticatedClient
      .query(ListHikeGroups)
      .pipe(map(response => _.get(response, 'data.listHikeGroups')));
  }

  delete(id: string): Observable<any> {
    return of(id);
  }

  getWithQuery(): Observable<any> {
    return throwError('This method cannot be used with graphql');
  }

  upsert(): Observable<any> {
    return throwError('This method cannot be used with graphql');
  }
}
