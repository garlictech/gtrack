import { HikePageModule } from '@bit/garlictech.angular.gtrack.pages/hike';
import { RouterModule, Routes } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { LayoutWebsiteModule } from '../layout/layout.component.website';
import { ToolbarHeaderModule } from '../../features/header';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'gtrack-hike-page-website',
  template: `
    <gtrack-toolbar-header></gtrack-toolbar-header>
    <ion-content fullScreen="true">
      <gtrack-layout-website [limitedWidth]="true">
        <gtrack-hike-page></gtrack-hike-page
      ></gtrack-layout-website>
    </ion-content>
  `,
  styleUrls: ['./hike.page.website.scss'],
})
export class HikePageWebsiteComponent {}

const routes: Routes = [
  {
    path: ':id',
    component: HikePageWebsiteComponent,
  },
];

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
    IonicModule,
    HikePageModule,
    ToolbarHeaderModule,
    LayoutWebsiteModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HikePageWebsiteComponent],
})
export class HikePageWebsiteModule {}
