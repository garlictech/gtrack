import { NGXLogger } from 'ngx-logger';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'gtrack-bookmark-page',
  templateUrl: './bookmark-page.component.html',
  styleUrls: ['./bookmark-page.component.scss'],
})
export class BookmarkPageComponent implements OnDestroy, OnInit {
  hikes$: Observable<CalculatedHike[] | undefined>;
  working$: Observable<boolean>;
  private readonly _destroy$: Subject<boolean>;

  constructor(private readonly log: NGXLogger) {
    //private readonly _loaderWatch: LoaderWatchService //private readonly hikeService: HikeService, //private readonly _store: Store,
    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    //this._store
    //  .pipe(
    //    select(this._objectMarkSelectors.getObjectMarkContext(EObjectMarkContext.bookmarkedHike)),
    //    takeUntil(this._destroy$)
    //  )
    //  .subscribe(context => {
    //    if (!context || (!context.loaded && !context.loading)) {
    //      this._store.dispatch(new objectMarkActions.LoadContext(EObjectMarkContext.bookmarkedHike));
    //    }
    //  });
    //this._store
    //  .pipe(
    //    select(this._objectMarkSelectors.getObjectMarks(EObjectMarkContext.bookmarkedHike)),
    //    switchMap(ids => this.hikeService.resolveByMultipleKeys(ids)),
    //    takeUntil(this._destroy$)
    //  )
    //  .subscribe();
    //this.hikes$ = this._store.pipe(
    //  select(this._objectMarkSelectors.getObjectMarks(EObjectMarkContext.bookmarkedHike)),
    //  takeUntil(this._destroy$),
    //  switchMap(ids => this.hikeService.resolveByMultipleKeys(ids)),
    //  tap(hikes => this.log.debug('Hikes', hikes))
    //);
    //// this.hikeListItems$ = createListItemStreamWithLoadingItemsAtFirst({
    ////   hikeListItems$: this.hikes$.pipe(map(convertHikesToHikeCardListItems))
    //// });
    //this._loaderWatch.setSpinnerOnWorkingForComponent(
    //  this.hikeService.loading$,
    //  this,
    //  'pages.common.home.page.working'
    //);
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
