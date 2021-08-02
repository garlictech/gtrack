import { RouterModule, Routes } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { LayoutWebsiteModule } from '../layout/layout.component.website';
import { HomePageModule } from '@bit/garlictech.angular.gtrack.pages/home';
import { IonicModule } from '@ionic/angular';
import { ToolbarHeaderModule } from '../../features/header';

@Component({
  selector: 'gtrack-home-page-website',
  template: `
    <gtrack-toolbar-header></gtrack-toolbar-header>
    <ion-content fullScreen="true">
      <gtrack-layout-website class="flex flex-col justify-center">
        <gtrack-home-page></gtrack-home-page>
      </gtrack-layout-website>
    </ion-content>
  `,
  styleUrls: ['./home.page.website.scss'],
})
export class HomePageWebsiteComponent {}

const routes: Routes = [
  {
    path: '',
    component: HomePageWebsiteComponent,
  },
];

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
    IonicModule,
    ToolbarHeaderModule,
    HomePageModule,
    LayoutWebsiteModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HomePageWebsiteComponent],
})
export class HomePageWebsiteModule {}
