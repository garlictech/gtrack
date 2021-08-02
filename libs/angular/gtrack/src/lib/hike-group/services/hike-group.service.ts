import { Injectable } from '@angular/core';
import {
  CreateHikeGroupInput,
  HikeGroup,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HikeGroupService extends EntityCollectionServiceBase<HikeGroup> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('HikeGroup', serviceElementsFactory);
  }

  add(input: CreateHikeGroupInput): Observable<HikeGroup> {
    return super.add(input as any);
  }
}
