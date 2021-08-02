import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  HikeData,
  PublicationState,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { HikeService } from '@bit/garlictech.angular.gtrack.hike-details';
import { CreateHikeInput } from '@bit/garlictech.universal.gtrack.graphql-api';
import { select, Store } from '@ngrx/store';
import {
  HikeEditorActions,
  HikeEditorFp,
  HikeEditorSelectors,
} from '@admin/features/hike-editor';
import * as fp from 'lodash/fp';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { handler, SourceType } from 'rx-handler';
import { combineLatest, from, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
  finalize,
  take,
} from 'rxjs/operators';
import { IsLoadingService } from '@service-work/is-loading';
import {
  CalculatedHike,
  CalculatedHikeFp,
} from '@bit/garlictech.universal.gtrack.hike';
import { pipe } from 'fp-ts/lib/function';

import { UpdateStr } from '@ngrx/entity/src/models';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HikeDetailsModule as BaseHikeDetailsModule } from '@bit/garlictech.angular.gtrack.hike-details';
import { PoiModule } from '@bit/garlictech.angular.gtrack.poi';
import { HikeDetailsModule } from '@bit/garlictech.angular.gtrack.hike-details';
import { AdminImageEditorModule } from '@admin/features/image-editor';
import {
  HikePlannerMapModule,
  HikeRoutePlannerModule,
} from '@admin/features/route-planner';
import { HikeGeneralInfoModule } from './components/hike-general-info';
import { HikePlanningModule } from './components/hike-planning';
import { NbButtonModule, NbCardModule, NbCheckboxModule } from '@nebular/theme';
import * as fromActions from '../../../../../../libs/admin/general-info/src/lib/+state/general-info.actions';

@UntilDestroy()
@Component({
  selector: 'gtrack-hike-editor-page',
  templateUrl: './hike-editor.component.html',
  styleUrls: ['./hike-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikeEditorPageComponent {
  hike$: Observable<CalculatedHike>;
  hikePublicationState$: Observable<PublicationState>;
  canSave$: Observable<boolean>;
  canPublish$: Observable<boolean>;
  canMakeDraft$: Observable<boolean>;
  canArchive$: Observable<boolean>;
  onSaveHike = handler();
  onSetPublicationState = handler();
  onMakeDraft = handler();
  onArchive = handler();
  onPublish = handler();


  constructor(
    private readonly _store: Store,
    private readonly hikeService: HikeService,
    private readonly isLoadingService: IsLoadingService
  ) {

    this.hike$ = this._store.pipe(
      select(HikeEditorSelectors.getCalculatedHike),
      distinctUntilChanged(fp.isEqual)
    );

    this.hikePublicationState$ = this.hike$.pipe(
      map(fp.property('publicationState'))
    );
    this.canSave$ = this._store.pipe(select(HikeEditorSelectors.isDirty));
    this.canPublish$ = this.hikePublicationState$.pipe(
      map(fp.isEqual(PublicationState.draft))
    );
    this.canMakeDraft$ = this.hikePublicationState$.pipe(
      map(fp.negate(fp.isEqual(PublicationState.draft)))
    );
    this.canArchive$ = this.hikePublicationState$.pipe(
      map(fp.isEqual(PublicationState.published))
    );

    from(this.onSaveHike)
      .pipe(
        untilDestroyed(this),
        withLatestFrom(combineLatest([this.canSave$, this.hike$])),
        filter(([, [canSave]]) => canSave),
        tap(() => this.isLoadingService.add()),
        map(([, [, hike]]) =>
          fp.flow(
            () => fp.omit(['__typename'], hike.data),
            (h: HikeData) =>
            ({
              ...h,
              description: fp.map(fp.omit(['__typename']), h.description),
              checkpoints: fp.isEmpty(h.checkpoints)
                ? undefined
                : fp.map(fp.omit(['__typename']), h.checkpoints),
            } as HikeData)
          )()
        ),
        map((hike: HikeData) =>
          HikeEditorFp.isNewHike(hike)
            ? fp.omit(['id'], hike)
            : pipe(CalculatedHikeFp.fromHikeData(hike), calcHike => ({
              changes: calcHike,
              id: hike.id,
            }))
        ),
        switchMap(hikeData =>
          this.hikeService
            .upsertObject(
              hikeData as UpdateStr<CalculatedHike> | CreateHikeInput
            )
            .pipe(
              take(1),
              finalize(() => this.isLoadingService.remove())
            )
        ),
        finalize(() => this.isLoadingService.remove())
      )
      .subscribe();

    const createUpdateHikeHandler = (
      handlerFv: SourceType<unknown, unknown>,
      hikeDataChangesFv: (
        data: Partial<HikeData>,
        eventData?: unknown
      ) => Partial<HikeData>
    ) =>
      from(handlerFv)
        .pipe(
          untilDestroyed(this),
          withLatestFrom(this.hike$),
          filter(([, hike]) => !!fp.get('data.id', hike)),
          tap(([eventData, hike]) =>
            this._store.dispatch(
              HikeEditorActions.updateHike({
                hikeProperties: {
                  ...hike.data,
                  ...hikeDataChangesFv(hike.data, eventData),
                },
              })
            )
          )
        )
        .subscribe();

  /*   createUpdateHikeHandler(this.onSetFeaturedState, data => ({
      featured: !data.featured,
    })); */
    createUpdateHikeHandler(this.onPublish, () => ({
      publicationState: PublicationState.published,
    }));
    createUpdateHikeHandler(this.onArchive, () => ({
      publicationState: PublicationState.archived,
    }));
    createUpdateHikeHandler(this.onMakeDraft, () => ({
      publicationState: PublicationState.draft,
    }));
  }

  onSetFeaturedState(): void {
    this._store.dispatch(fromActions.loadGeneralInfoSuccess({ generalInfo: [] }));
  }

  // private _parseGpxRoute(): void {
  // We have to wait for the map
  // this._store
  //   .pipe(
  //     select(leafletMapSelectors.getMapId),
  //     filter(id => id !== ''),
  //     take(1)
  //   )
  //   .subscribe(() => {
  //     this._routePlannerService.drawRouteLinethis.hikeEditingService.gpxRoute.route.features[0]);
  //     // Load path to routePlanner state - necessary for drawing pois
  //     const bounds: L.LatLngBoundsExpression = [
  //       [
  //         this.hikeEditingService.gpxRoute.bounds.NorthEast.lat,
  //         this.hikeEditingService.gpxRoute.bounds.NorthEast.lon
  //       ],
  //       [this.hikeEditingService.gpxRoute.bounds.SouthWest.lat, this.hikeEditingService.gpxRoute.bounds.SouthWest.lon]
  //     ];
  //     this._routePlannerService.addRouteToTheStore(
  //       this.hikeEditingService.gpxRoute.route,
  //       this.hikeEditingService.gpxRoute.bounds
  //     );
  //     LeafletMapFp.fitBounds(bounds);
  //     delete this.hikeEditingService.gpxRoute;
  //   });
  // }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HikePlannerMapModule,
    BaseHikeDetailsModule,
    HikeDetailsModule,
    PoiModule,
    HikeRoutePlannerModule,
    HikePlanningModule,
    HikeGeneralInfoModule,
    AdminImageEditorModule,
    NbCheckboxModule,
    NbButtonModule,
    NbCardModule,
  ],
  exports: [HikeEditorPageComponent],
  declarations: [HikeEditorPageComponent],
})
export class HikeEditorPageModule { }
