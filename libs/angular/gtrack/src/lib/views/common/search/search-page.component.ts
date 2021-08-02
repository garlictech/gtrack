import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule } from '@angular/router';
import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { SearchFilterActions } from '@bit/garlictech.angular.gtrack.search';
import {
  HikeSearchResultsComponentModule,
  SearchFiltersComponentModule,
} from '@bit/garlictech.angular.gtrack.search-ionic';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSlidersH, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import * as fp from 'lodash/fp';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { IonicModule } from '@ionic/angular';
import { CommonHeaderModule } from '@bit/garlictech.angular.gtrack.gtrack-header';

@UntilDestroy()
@Component({
  selector: 'gtrack-search-page',
  template: `
    <gtrack-common-header></gtrack-common-header>
    <ion-content fullscreen>
      <gtrack-ionic-content>
        <div class="h-full">
          <gtrack-hike-search-results></gtrack-hike-search-results>
        </div>
      </gtrack-ionic-content>
    </ion-content>
  `,
  styleUrls: ['./search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {
  icon: IconDefinition;
  showFilters: boolean;
  hikes$: Observable<CalculatedHike[]>;

  constructor(
    private readonly _route: ActivatedRoute,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>
  ) {
    this.icon = faSlidersH;
    this.showFilters = false;

    const centerCoords$ = this._route.queryParams.pipe(
      filter(q => !fp.isNil(q.lat) && !fp.isNil(q.lon)),
      map(q => ({ lat: parseFloat(q.lat), lon: parseFloat(q.lon) })),
      filter(center => !fp.isNil(center.lat) && !fp.isNil(center.lon)),
      shareReplay(1)
    );

    centerCoords$
      .pipe(
        untilDestroyed(this),
        tap((center: Point) =>
          this.store.dispatch(SearchFilterActions.ChangeFilters({ center }))
        )
      )
      .subscribe();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}

const routes: Routes = [
  {
    path: '',
    component: SearchPageComponent,
  },
];

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  declarations: [SearchPageComponent],
  imports: [
    CommonModule,
    SearchFiltersComponentModule,
    HikeSearchResultsComponentModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
    FontAwesomeModule,
    IonicModule,
    CommonHeaderModule,
  ],
  exports: [SearchPageComponent],
})
export class SearchPageComponentModule {}
