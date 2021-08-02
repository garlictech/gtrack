import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',

            loadChildren: () =>
              import('../pages/home.page').then(m => m.HomePageAppModule),
          },
          //{
          //  path: 'search',
          //  loadChildren: () =>
          //    import('@bit/garlictech.angular.gtrack.views/common/search').then(
          //      m => m.SearchPageComponentModule
          //    ),
          //},
          //{
          //  path: 'hike',
          //  loadChildren: () =>
          //    import('@app/pages/app-hike-page.component').then(
          //      m => m.AppHikePageModule
          //    ),
          //},
          //{
          //  path: 'poi',
          //  loadChildren: () =>
          //    import('@app/pages/poi/poi.page.module').then(m => m.PoiPageModule),
          //},
          //{
          //  path: 'documents',
          //  loadChildren: (): any =>
          //    import(
          //      '@bit/garlictech.angular.gtrack.pages/documents-page.component'
          //    ).then(m => m.DocumentsPageModule),
          //},
          //{
          //  path: 'contact',
          //  loadChildren: (): any =>
          //    import('@bit/garlictech.angular.gtrack.views/common/contact').then(
          //      m => m.ContactPageModule
          //    ),
          //},
        ],
      },
      {
        path: 'activity',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/activity/activity.module').then(
                m => m.ActivityPageModule
              ),
          },
        ],
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/profile/profile.module').then(
                m => m.ProfilePageModule
              ),
          },
        ],
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/settings/settings-page.component').then(
                m => m.SettingsPageModule
              ),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
