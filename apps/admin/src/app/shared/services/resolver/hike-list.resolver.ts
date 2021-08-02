import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HikeService } from '@bit/garlictech.angular.gtrack.hike-details';
import { RouterActions } from '@bit/garlictech.angular.gtrack.router';
import { Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HikeListResolver implements Resolve<boolean> {
  constructor(
    private readonly hikeService: HikeService,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>
  ) {}

  resolve(): Observable<boolean> {
    return this.hikeService.getAll().pipe(
      mapTo(true),
      catchError(() => {
        this.store.dispatch(new RouterActions.Go('/error'));
        return of(false);
      })
    );
  }
}
