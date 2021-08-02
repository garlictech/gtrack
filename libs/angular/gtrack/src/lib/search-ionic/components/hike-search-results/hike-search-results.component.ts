import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  NgModule,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Circle } from '@bit/garlictech.universal.gtrack.geometry/interfaces';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import {
  HikesMapComponent,
  HikesMapModule,
} from '@bit/garlictech.angular.gtrack.hikes-map';
import { RouterActions } from '@bit/garlictech.angular.gtrack.router';
import {
  FeaturedHikesService,
  SearchFiltersSelectors,
} from '@bit/garlictech.angular.gtrack.search';
import { SharedGenericUiUiIonicModule } from '@gtrack/shared/generic-ui/ui-ionic';
import { HikeDetailsModule } from '@bit/garlictech.angular.gtrack.hike-details-ionic';
import { HikeListModule } from '@bit/garlictech.angular.gtrack.hike-list-ionic';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  SearchFiltersComponentModule,
  SearchFiltersComponent,
} from '../search-filters/search-filters.component';
import { IonicModule, ModalController, Platform } from '@ionic/angular';
import { SearchModule } from '@bit/garlictech.angular.gtrack.search';
import { ResizeService } from '@gtrack/shared/generic-ui/data-access';

@Component({
  selector: 'gtrack-hike-search-results',
  templateUrl: './hike-search-results.component.html',
  styleUrls: ['./hike-search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikeSearchResultsComponent {
  @ViewChild(HikesMapComponent, { static: true })
  searchResultsMap: HikesMapComponent;

  hikes$: Observable<CalculatedHike[]>;
  isSearching$!: Observable<boolean>;
  searchCircle$: Observable<Circle>;
  mapShown = false;
  filtersShown = false;
  activeHike?: CalculatedHike;
  isMinXlScreen: boolean;
  buttonSize = 'small';
  isMobile: boolean;

  @HostListener('window:resize', [])
  private onResize() {
    this.isMinXlScreen = this.resizeSvc.isMinXlScreen();
    this.buttonSize = this.resizeSvc.isMinMdScreen() ? 'big' : 'small';
  }

  constructor(
    private readonly _platform: Platform,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly featuredHikesService: FeaturedHikesService,
    public modalController: ModalController,
    private resizeSvc: ResizeService
  ) {
    this.isSearching$! = this.store.select(SearchFiltersSelectors.isSearching);
    this.searchCircle$ = this.store.select(
      SearchFiltersSelectors.getSearchCircle
    );
    this.hikes$ = this.featuredHikesService.currentFilteredHikes$;
    this.onResize();
    this.isMobile =
      this._platform.is('capacitor') ||
      this._platform.is('ios') ||
      this._platform.is('mobile') ||
      this._platform.is('android') ||
      this._platform.is('hybrid');
  }

  showMap(): void {
    this.mapShown = true;
    this.filtersShown = false;
  }

  showList(): void {
    this.mapShown = false;
    this.filtersShown = false;
  }

  async showFilters(): Promise<void> {
    const modal = await this.modalController.create({
      component: SearchFiltersComponent,
      swipeToClose: true,
      mode: 'ios',
    });
    return await modal.present();
  }

  onHikeClick(hike: CalculatedHike): void {
    this.store.dispatch(new RouterActions.Go(['hike', hike.id]));
  }

  onHikeHover(hike: CalculatedHike): void {
    this.activeHike = hike;
  }

  onHikeLeave(): void {
    this.activeHike = undefined;
  }

  trackByFn(index: number): number {
    return index;
  }
}

@NgModule({
  declarations: [HikeSearchResultsComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    HikeDetailsModule,
    HikeListModule,
    RouterModule,
    SearchFiltersComponentModule,
    TranslateModule.forChild(),
    HikesMapModule,
    SearchModule,
    SharedGenericUiUiIonicModule,
    IonicModule,
  ],
  exports: [HikeSearchResultsComponent],
})
export class HikeSearchResultsComponentModule { }
