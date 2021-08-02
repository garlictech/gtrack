import { Injectable } from '@angular/core';
import { CommentMessage } from '@bit/garlictech.angular.gtrack.gtrack-interfaces';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

@Injectable({ providedIn: 'root' })
export class MessageService extends EntityCollectionServiceBase<
  CommentMessage
> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('CommentMessage', serviceElementsFactory);
  }
}
