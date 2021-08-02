import { NGXLogger } from 'ngx-logger';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'gtrack-common-bookmark',
  template: '',
})
export class BookmarkComponent implements OnDestroy, OnInit {
  @Input() hikeId: string;

  state$: Observable<boolean>;
  loggedIn$: Observable<boolean>;

  protected _destroy$: Subject<boolean>;

  constructor(private readonly log: NGXLogger, protected _store: Store) {
    // this._destroy$ = new Subject<boolean>();
    // this.loggedIn$ = this._store.pipe(select(AuthenticationSelectors.loggedIn));
    // combineLatest([
    //   this.loggedIn$,
    //   this._store.pipe(select(this._objectMarkSelectors.getObjectMarkContext(EObjectMarkContext.bookmarkedHike)))
    // ])
    //   .pipe(
    //     filter(data => data[0]),
    //     take(1),
    //     map(data => data[1])
    //   )
    //   .subscribe(context => {
    //     this.log.debug('Current context: ', context);
    //     if (!context || (!context.loaded && !context.loading)) {
    //       this.log.debug('Dispatch load context');
    //       this._store.dispatch(new actions.LoadContext(EObjectMarkContext.bookmarkedHike));
    //     }
    //   });
    // combineLatest([
    //   this.loggedIn$,
    //   this._store.pipe(select(this._objectMarkSelectors.getObjectMarkContext(EObjectMarkContext.bookmarkedHike)))
    // ])
    //   .pipe(
    //     takeUntil(this._destroy$),
    //     filter(data => data[0]),
    //     map(data => data[1]),
    //     filter(context => _get(context, 'saved', false)),
    //     delay(50) // TODO: remove this
    //   )
    //   .subscribe(() => {
    //     this.log.debug('Dispatch load context (because of mark)');
    //     this._store.dispatch(new actions.LoadContext(EObjectMarkContext.bookmarkedHike));
    //   });
  }

  bookmarkHike(): void {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   combineLatest([
    //     this.loggedIn$,
    //     this._store.select(this._objectMarkSelectors.isObjectMarked(EObjectMarkContext.bookmarkedHike, this.hikeId)),
    //   ])
    //     .pipe(
    //       take(1),
    //       filter(data => data[0]),
    //       map(data => data[1])
    //     )
    //     .subscribe(state => {
    //       this.log.debug('Current state before bookmark', state);
    //       const mark = !state;
    //       this._store.dispatch(new actions.MarkObject(EObjectMarkContext.bookmarkedHike, this.hikeId, mark));
    //     });
  }

  ngOnInit(): void {
    // this.state$ = this._store.pipe(
    //   select(this._objectMarkSelectors.isObjectMarked(EObjectMarkContext.bookmarkedHike, this.hikeId)),
    //   takeUntil(this._destroy$),
    //   tap(marked => this.log.debug('Current state: ', marked))
    // );
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
