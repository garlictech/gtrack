import { SharedGenericUiFeatureIonicModule } from '@gtrack/shared/generic-ui/feature-ionic';
import { SharedLocalizationFeatureIonicModule } from '@gtrack/shared/localization/feature-ionic';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgModule,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  TextualDescription,
  HikeData,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { HikeCardComponentModule } from '@bit/garlictech.angular.gtrack.hike-list-ionic';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  HikeEditorActions,
  HikeEditorSelectors,
} from '@admin/features/hike-editor';
import { RoutePlannerSelectors } from '@admin/features/route-planner';
import { LocalizedDescriptionModule } from '@admin/shared/components/localized-description';
import * as fp from 'lodash/fp';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { handler, SourceType } from 'rx-handler';
import { from, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

// import { HikeGroupSelectors } from '@bit/garlictech.angular.gtrack.hike-group';
@UntilDestroy()
@Component({
  selector: 'gtrack-hike-general-info',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikeGeneralInfoComponent implements AfterViewInit {
  hike$: Observable<HikeData>;
  remoteError$: Observable<boolean>;
  isRoundTrip$: Observable<boolean>;
  description$: Observable<TextualDescription[]>;

  onDeleteDescription: SourceType<
    TextualDescription,
    TextualDescription
  > = handler();
  onSubmitDescription: SourceType<
    TextualDescription,
    TextualDescription
  > = handler();

  constructor(
    private readonly _store: Store,
    // private readonly _hikeGroupSelectors: HikeGroupSelectors,
    private readonly _changeDetectorRef: ChangeDetectorRef
  ) {
    this.hike$ = this._store
      .select(HikeEditorSelectors.getHike)
      .pipe(distinctUntilChanged(fp.isEqual));
    this.isRoundTrip$ = this._store
      .select(RoutePlannerSelectors.getIsRoundTrip)
      .pipe(distinctUntilChanged(fp.isEqual));
    this.remoteError$ = this._store.select(HikeEditorSelectors.getError);

    const createDescriptionHandler = (
      descHandler: SourceType<TextualDescription, TextualDescription>,
      operation: (
        data: TextualDescription,
        currentDescriptions: TextualDescription[]
      ) => TextualDescription[]
    ) =>
      from(descHandler)
        .pipe(
          untilDestroyed(this),
          withLatestFrom(this.hike$),
          filter(([, hike]) => !!hike.description),
          tap(([data, hike]: [TextualDescription, HikeData]) =>
            this._store.dispatch(
              HikeEditorActions.updateHike({
                hikeProperties: {
                  ...hike,
                  description: operation(data, hike.description),
                },
              })
            )
          )
        )
        .subscribe();

    createDescriptionHandler(
      this.onDeleteDescription,
      (data: TextualDescription, currentDescriptions: TextualDescription[]) =>
        fp.reject({ languageKey: data.languageKey }, currentDescriptions)
    );

    createDescriptionHandler(
      this.onSubmitDescription,
      (data: TextualDescription, currentDescriptions: TextualDescription[]) =>
        fp.flow(
          fp.reject({ languageKey: data.languageKey }),
          fp.concat(data)
        )(currentDescriptions)
    );

    this.description$ = this.hike$.pipe(
      map(hike => hike.description),
      distinctUntilChanged(fp.isEqual)
    );
  }

  ngAfterViewInit(): void {
    this._changeDetectorRef.detectChanges();
  }

  // eslint:disable-next-line:no-property-initializer
  trackByFn(index: number): number {
    return index;
  }
}

@NgModule({
  imports: [
    LocalizedDescriptionModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedLocalizationFeatureIonicModule,
    SharedGenericUiFeatureIonicModule,
    RouterModule,
    HikeCardComponentModule,
  ],
  exports: [HikeGeneralInfoComponent],
  declarations: [HikeGeneralInfoComponent],
})
export class HikeGeneralInfoModule {}
