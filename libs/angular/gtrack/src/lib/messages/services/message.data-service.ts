import { Injectable } from '@angular/core';
import { CommentMessage } from '@bit/garlictech.angular.gtrack.gtrack-interfaces';
import { EntityCollectionDataService } from '@ngrx/data';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/internal/operators';

@Injectable({ providedIn: 'root' })
export class MessageDataService
  implements EntityCollectionDataService<CommentMessage> {
  readonly name: string;

  add(entity: CommentMessage): Observable<CommentMessage> {
    return of(entity).pipe(delay(500));
  }

  delete(id: number | string): Observable<number | string> {
    return of(id).pipe(delay(500));
  }

  getAll(): Observable<CommentMessage[]> {
    return of([]).pipe(delay(500));
  }

  getById(): Observable<CommentMessage> {
    return of(undefined).pipe(delay(500));
  }

  getWithQuery(): Observable<CommentMessage[]> {
    return of([]).pipe(delay(500));
  }

  update(): Observable<CommentMessage> {
    return of(undefined).pipe(delay(500));
  }

  upsert(): Observable<CommentMessage> {
    return of(undefined).pipe(delay(500));
  }
}
