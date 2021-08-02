import { Routes } from '@angular/router';
import { NotFound404Component } from './not-found404.component';

export const routes: Routes =  [
  {
    path: 'start',
    loadChildren: () =>
      import('./pages/home/home.page.website').then(
        m => m.HomePageWebsiteModule
      ),
  },
  {
    path: 'hike',
    loadChildren: () =>
      import('./pages/hike/hike.page.website').then(
        m => m.HikePageWebsiteModule
      ),
  },
  //  {
  //    path: 'search',
  //    loadChildren: (): any =>
  //      import('@bit/garlictech.angular.gtrack.views/common/search').then(
  //        m => m.SearchPageComponentModule
  //      ),
  //  },
  //  {
  //    path: 'info',
  //    loadChildren: (): any =>
  //      import('@bit/garlictech.angular.gtrack.views/common/info').then(
  //        m => m.InfoPageComponentModule
  //      ),
  //  },
  //  {
  //    path: 'contact',
  //    loadChildren: (): any =>
  //      import('@bit/garlictech.angular.gtrack.views/common/contact').then(
  //        m => m.ContactPageModule
  //      ),
  //  },
  //  {
  //    path: 'poi',
  //    loadChildren: (): any =>
  //      import('@bit/garlictech.angular.gtrack.pages/poi-page.component').then(
  //        m => m.PoiPageModule
  //      ),
  //  },
  //  {
  //    path: 'documents',
  //    loadChildren: (): any =>
  //      import(
  //        '@bit/garlictech.angular.gtrack.pages/documents-page.component'
  //      ).then(m => m.DocumentsPageModule),
  //  },
  { path: '', pathMatch: 'full', redirectTo: 'start' },
  // {
  //   path: 'user',
  //   children: userRoutes,
  //   canActivate: [AdminAuthGuard],
  //   data: { message: 'authentication.signInProfile', enabledRole: EAuthRoles.user },
  // },
  {
    path: '**',
    component: NotFound404Component,
  },
];
