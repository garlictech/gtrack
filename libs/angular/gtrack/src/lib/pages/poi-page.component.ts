import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { PoiService } from '@bit/garlictech.angular.gtrack.poi';
import { PoiDetailsComponentModule } from '@bit/garlictech.angular.gtrack.poi-ionic';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { RouterModule as StoreRouterModule } from '@bit/garlictech.angular.gtrack.router';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { CommonHeaderModule } from '@bit/garlictech.angular.gtrack.gtrack-header';

@Component({
  selector: 'gtrack-poi-page',
  template: `
    <gtrack-common-header></gtrack-common-header>

    <ion-content fullscreen scroll-y="true" scroll-x="false">
      <gtrack-ionic-content>
        <gtrack-poi-details [poi$]="poi$"> </gtrack-poi-details>
      </gtrack-ionic-content>
    </ion-content>
  `,
  styleUrls: ['./poi-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiPageComponent implements OnInit {
  poi$: Observable<Poi>;

  constructor(private readonly _poiService: PoiService) {}

  ngOnInit(): void {
    this.poi$ = this._poiService.resolveByRouteParam().pipe(shareReplay(1));
  }
}

export const routes: Routes = [
  {
    path: ':id',
    component: PoiPageComponent,
  },
];

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
    PoiDetailsComponentModule,
    IonicModule,
    StoreRouterModule,
    CommonHeaderModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PoiPageComponent],
  exports: [PoiPageComponent],
})
export class PoiPageModule {}
