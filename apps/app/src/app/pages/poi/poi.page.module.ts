import { CommonModule } from '@angular/common';
import { RouterModule as StoreRouterModule } from '@bit/garlictech.angular.gtrack.router';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoiPageModule as CommonPoiPageModule } from '@bit/garlictech.angular.gtrack.pages/poi-page.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PoiPageComponent } from './poi.page.component';

const routes: Routes = [
  {
    path: ':id',
    component: PoiPageComponent,
  },
];

@NgModule({
  declarations: [PoiPageComponent],
  imports: [
    CommonModule,
    CommonPoiPageModule,
    IonicModule,
    StoreRouterModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
})
export class PoiPageModule {}
