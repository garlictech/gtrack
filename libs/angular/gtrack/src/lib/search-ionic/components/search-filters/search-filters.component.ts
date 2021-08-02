import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FeaturedHikesService } from '@bit/garlictech.angular.gtrack.search';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils';
import { SharedFormsFeatureModule } from '@gtrack/shared/forms/feature';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSlidersH,
  faTimes,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchFiltersFormComponent } from '../search-filters-form/search-filters-form.component';

@Component({
  selector: 'gtrack-search-filters',
  template: `
    <div class="">
      <ion-fab-button
        color="success"
        mode="ios"
        size="small"
        translucent="true"
        (click)="dismiss()"
      >
        <ion-icon name="close-outline"></ion-icon
      ></ion-fab-button>
      <gtrack-search-filters-form></gtrack-search-filters-form>
      <ion-badge color="secondary" class="text-xl p-2 m-6">
        {{ 'search.foundHikeNumber' | translate }}:
        {{ hikeNumber$ | async }}</ion-badge
      >
    </div>
  `,
  styleUrls: ['./search-filters.component.scss'],
})
export class SearchFiltersComponent {
  @Output() readonly closeClick: EventEmitter<void>;
  icon: IconDefinition;
  closeIcon: IconDefinition;
  hikeNumber$: Observable<number>;

  constructor(
    private readonly featuredHikesService: FeaturedHikesService,
    public modalController: ModalController
  ) {
    this.closeClick = new EventEmitter<void>();
    this.icon = faSlidersH;
    this.closeIcon = faTimes;
    this.hikeNumber$ = this.featuredHikesService.currentFilteredHikes$.pipe(
      map(hikes => hikes.length)
    );
  }

  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}

@NgModule({
  declarations: [SearchFiltersComponent, SearchFiltersFormComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    IonicModule,
    TranslateModule,
    UtilsModule,
    ReactiveFormsModule,
    SharedFormsFeatureModule,
  ],
  exports: [SearchFiltersComponent],
  providers: [],
})
export class SearchFiltersComponentModule {}
