import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  Output,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { HikeService } from '@bit/garlictech.angular.gtrack.hike-details';
import { RouterActions } from '@bit/garlictech.angular.gtrack.router';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils/utils.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/pro-light-svg-icons';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { fromEvent, of } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { PlaceType } from '@bit/garlictech.universal.gtrack.graphql-api';
import { SettingsSharedGenericUiDataAccessModule } from '../../customer/settings-pipes.module';

@UntilDestroy()
@Component({
  selector: 'gtrack-title-search',
  template: `
    <div class="">
      <div class="search-container">
        <fa-icon [icon]="searchIcon"></fa-icon>
        <input
          #titlesearch
          [placeholder]="'common.hike.location-search.search-title' | translate"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="off"
          onfocus="this.value=''"
        />
      </div>

      <ion-progress-bar
        type="indeterminate"
        color="primary"
        *ngIf="isWorking"
      ></ion-progress-bar>

      <div
        *ngIf="searchResults.length > 0"
        class="mt-1 rounded-sm border-solid border-gray-700 border max-w-lg hits-background"
      >
        <div
          class="cursor-pointer text-white bg-transparent px-2 border-solid border-gray-700 border-t last:border-t-0 uppercase leading-loose"
          *ngFor="let hike of searchResults"
          (click)="goToHikePage(hike)"
        >
          <div class="">{{ hike.data.description[0].title }}</div>
          <div class=" text-sm">
            <span class="font-black">{{
              'common.hike.data.distance' | translate
            }}</span
            >: {{ hike.route.distance | distance | async }}
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./search.styles.scss']
})
export class TitleSearchComponent implements AfterViewInit {
  @Input() context: string;

  @Input() placeholder: string;
  @Input() displaySidebar: any;

  @Output() readonly displaySidebarChange: EventEmitter<boolean>;
/*   @Output() readonly search: EventEmitter<Position>;
 */
  searchIcon: IconDefinition = faSearch;

/*   protected _location?: Position;
 */  protected _address: string;
  @ViewChild('titlesearch', { read: ElementRef, static: true })
  _searchElementRef: ElementRef;

  _input: HTMLElement;
  isWorking = false;

  searchResults!: CalculatedHike[];

  constructor(
    private readonly hikeService: HikeService,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>
  ) {
    this._address = 'my-location';
    this.displaySidebarChange = new EventEmitter();
/*     this.search = new EventEmitter<Position>();
 */  }

  ngAfterViewInit(): void {
    const input: any = this._searchElementRef.nativeElement;

    fromEvent(input, 'keyup')
      .pipe(
        debounceTime(500),
        tap(() => (this.isWorking = input.value.length > 3)),
        switchMap(() =>
          input.value.length <= 3
            ? of([])
            : this.hikeService.searchByTitle({
                searchTerm: input.value,
                placeType: PlaceType.hike
              })
        ),
        tap(results => {
          this.isWorking = false;
          this.searchResults = results;
        }),
        untilDestroyed(this)
      )
      .subscribe();

    fromEvent(input, 'focusout')
      .pipe(
        tap(() => (this.isWorking = false)),
        delay(300),
        tap(() => (this.searchResults = [])),
        untilDestroyed(this)
      )
      .subscribe();
  }

  goToHikePage(hike: CalculatedHike): void {
    this.store.dispatch(new RouterActions.Go(['hike', hike.data.id]));
  }
}

@NgModule({
  declarations: [TitleSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FontAwesomeModule,
    IonicModule,
    RouterModule,
    UtilsModule,
    SettingsSharedGenericUiDataAccessModule
  ],
  exports: [TitleSearchComponent],
  providers: []
})
export class TitleSearchComponentModule {}
