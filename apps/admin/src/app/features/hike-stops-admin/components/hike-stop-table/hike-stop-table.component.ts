import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PoiIconRowComponentModule } from '@bit/garlictech.angular.gtrack.poi-icons';
import { SharedLocalizationFeatureIonicModule } from '@gtrack/shared/localization/feature-ionic';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils';
import { Store } from '@ngrx/store';
import { sortBy } from 'lodash';
import { HikeStop } from '@bit/garlictech.universal.gtrack.hike-stops';
import { HikeStopActions } from '@bit/garlictech.angular.gtrack.hike-stops/store';
import { NbButtonModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Observable } from 'rxjs';

@Component({
  selector: 'gtrack-hike-stop-table',
  templateUrl: './hike-stop-table.html',
})
export class HikeStopTableComponent {
  @Input() openPoiModal: boolean;

  @Input() set hikeStops(stops: HikeStop[]) {
    this._hikeStops = sortBy(stops, ['distanceFromStart']);
  }

  get hikeStops(): HikeStop[] {
    return this._hikeStops;
  }

  @ViewChild('theTable', { static: true }) theTable: { reset: () => void };

  private _hikeStops: HikeStop[];
  typeList$: Observable<string>;

  settings = {
    hideSubHeader: true,
    actions: {
      add: false,
    },
    delete: {
      confirmDelete: true,
      deleteButtonContent: '<i class="fa fa-trash" style="font-size:20px"></i>',
      saveButtonContent: 'save',
      cancelButtonContent: 'cancel',
    },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="fa fa-edit" style="font-size:20px"></i>',
    },
    columns: {
      icon: {
        title: 'Icon',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<gtrack-poi-icon [types]="${row.poi.types[0]}"></gtrack-poi-icon>`; // needs renderer to show custom component here
        },
      },
      title: {
        title: 'Title',
        valuePrepareFunction: (_cell, row) => {
          return row.poi.description.map(p => p.title);
        },
      },
      language: {
        title: 'Language',
        valuePrepareFunction: (_cell, row) => {
          return row.poi.sourceObject
            .map(p => p.languageKey)
            .filter(this.onlyUnique);
        },
      },
      distanceFromRoute: {
        title: 'Distance from route',
      },
      distanceFromStart: {
        title: 'Distance from start',
      },
      types: {
        title: 'Types',
        valuePrepareFunction: (_cell, row) => {
          return row.poi.types.filter(this.onlyUnique);
        },
      },
      source: {
        title: 'Source',
        valuePrepareFunction: (_cell, row) => {
          return row.poi.sourceObject
            .map(p => p.objectType)
            .filter(this.onlyUnique);
        },
      },
      url: {
        title: 'Url',
        valuePrepareFunction: (_cell, row) => {
          return row.poi.sourceObject.map(p => p.url).filter(this.onlyUnique);
        },
      },
    },
  };

  constructor(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>
  ) {}

  deletePoi(stop: HikeStop): void {
    //this.poiService.delete(stop.poi);
    this.store.dispatch(HikeStopActions.DeleteHikeStops({ stops: [stop] }));
  }

  deleteAllPois(): void {
    //fp.each(stop => this.poiService.delete(stop.poi), this._hikeStops);
    this.store.dispatch(
      HikeStopActions.DeleteHikeStops({ stops: this._hikeStops })
    );
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}

@NgModule({
  imports: [
    CommonModule,
    PoiIconRowComponentModule,
    SharedLocalizationFeatureIonicModule,
    FormsModule,
    UtilsModule,
    NbButtonModule,
    Ng2SmartTableModule,
  ],
  exports: [HikeStopTableComponent],
  declarations: [HikeStopTableComponent],
})
export class HikeStopTableModule {}
