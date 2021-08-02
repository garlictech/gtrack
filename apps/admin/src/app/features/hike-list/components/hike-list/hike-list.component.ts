import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { PublicationState } from '@bit/garlictech.universal.gtrack.graphql-api';
import { HikeService } from '@bit/garlictech.angular.gtrack.hike-details';
import { newHikeId } from '@admin/features/hike-editor';
import { Observable } from 'rxjs';
import { SharedLocalizationFeatureIonicModule } from '@gtrack/shared/localization/feature-ionic';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils';
import { GpxInputComponent } from '../gpx-input';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { SharedGenericUiFeatureIonicModule } from '@gtrack/shared/generic-ui/feature-ionic';
import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbTreeGridModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@Component({
  selector: 'gtrack-app-hike-list',
  templateUrl: './hike-list.component.html',
  styleUrls: ['./hike-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikeListComponent implements OnInit {
  hikeList$: Observable<CalculatedHike[]>;
  selectedListState: PublicationState | 'all';
  listStates: unknown;
  settings: unknown;

  constructor(
    private readonly hikeService: HikeService,
    private readonly _title: Title
  ) {
    this.selectedListState = 'all';

    this.listStates = [
      { label: 'All', value: 'all' },
      { label: 'Published', value: 'published' },
      { label: 'Draft', value: 'draft' },
      { label: 'Archived', value: 'archived' },
    ];

    this.settings = {
      columns: {
        title: {
          title: 'Title',
        },
        length: {
          title: 'Length',
        },
        published: {
          title: 'Published',
        },
      },
    };
  }

  ngOnInit(): void {
    this._title.setTitle('Hikes');
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + nextColumnStep * index;
  }

  deleteHike(hike: CalculatedHike): void {
    this.hikeService.delete(hike);
    // this._confirmationService.confirm({
    //   message: 'Are you sure that you want to delete?',
    //   accept: () => this.hikeService.delete(hike),
    // });
  }

  canDelete(hike: CalculatedHike): boolean {
    return hike.data.publicationState === PublicationState.draft;
  }

  newHikeRoute(): string {
    return `/admin/hike/${newHikeId}`;
  }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedLocalizationFeatureIonicModule,
    SharedGenericUiFeatureIonicModule,
    UtilsModule,
    NbCardModule,
    NbTreeGridModule,
    NbButtonModule,
    NbSelectModule,
    Ng2SmartTableModule,
    NbInputModule,
  ],
  exports: [HikeListComponent],
  declarations: [HikeListComponent, GpxInputComponent],
})
export class HikeListModule {}
