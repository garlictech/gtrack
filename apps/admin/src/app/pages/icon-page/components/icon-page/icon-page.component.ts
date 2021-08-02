import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedLocalizationDataAccessModule } from '@gtrack/shared/localization/data-access';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { PoiIconLabelledComponentModule } from '@bit/garlictech.angular.gtrack.poi-icons';

import { Observable } from 'rxjs';
import { IconService } from '../../services/icon-service';
import { IconDetails } from '@bit/garlictech.angular.gtrack.poi-icons/components/poi-icon-row-labelled.component';
import { SharedLocalizationFeatureIonicModule } from '@gtrack/shared/localization/feature-ionic';

@Component({
  selector: 'gtrack-icon-page',
  template: `<ion-content>
    <gtrack-language-selector class="w-full"></gtrack-language-selector>
    <div
      class="inline-block mr-2 leading-8 p-2 border border-white m-1"
      [ngClass]="{ 'unknown-icon': !iconType.knownIcon }"
      *ngFor="let iconType of iconSetDetails$ | async"
    >
      <gtrack-poi-icon-labelled
        [icon]="iconType?.icon"
        [label]="iconType?.translatedType"
      ></gtrack-poi-icon-labelled>
      <div class="font-mono">{{ iconType.iconTag }}</div>
    </div>
  </ion-content> `,
  styles: [
    `
      .unknown-icon {
        border-width: 8px;
        border-color: #ff0000;
      }
    `,
  ],
})
export class IconPageComponent {
  iconSetDetails$: Observable<IconDetails[]>;

  constructor(private icons: IconService) {
    this.iconSetDetails$ = this.icons.getIconDetails();
  }
}
const routes: Routes = [
  {
    path: '',
    component: IconPageComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    SharedLocalizationDataAccessModule,
    SharedLocalizationFeatureIonicModule,
    IonicModule,
    RouterModule.forChild(routes),
    PoiIconLabelledComponentModule,
  ],
  exports: [IconPageComponent],
  declarations: [IconPageComponent],
})
export class IconPageModule {}
