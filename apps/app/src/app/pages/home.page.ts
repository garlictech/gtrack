import { RouterModule, Routes } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { LayoutAppModule } from './layout/layout.component.app';
import { HomePageModule } from '@bit/garlictech.angular.gtrack.pages/home';

@Component({
  selector: 'gtrack-home-page-app',
  template: `<gtrack-layout-app>
    <gtrack-home-page></gtrack-home-page
  ></gtrack-layout-app> `,
})
export class HomePageAppComponent {}

const routes: Routes = [
  {
    path: '',
    component: HomePageAppComponent,
  },
];

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [HomePageModule, LayoutAppModule, RouterModule.forChild(routes)],
  declarations: [HomePageAppComponent],
})
export class HomePageAppModule {}
