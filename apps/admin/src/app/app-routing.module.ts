import { NgModule } from '@angular/core';
import {
  Route,
  Routes,
  RouterModule,
  PreloadAllModules,
} from '@angular/router';
import { AuthRedirects } from '@gtrack/shared/authentication/data-access';
import { AdminHomeModule } from './core/components/home-page';
import { AuthModule } from './features/auth';
import { NotFound404Component } from './not-found404.component';
import { HikeListPageComponent } from './pages/hike-list.page.component';
import { IconPageModule } from './pages/icon-page/components/icon-page/icon-page.component';
import { HikeListResolver } from './shared/services/resolver/hike-list.resolver';

// import { HikeGroupComponent } from './pages/hike-group';
// import { HikeGroupListComponent } from './pages/hike-group-list/hike-group-list.component';
const fallbackRoute: Route = { path: '**', component: NotFound404Component };

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin' },
  {
    path: 'admin',
    loadChildren: (): Promise<typeof AdminHomeModule> =>
      import('./core/components/home-page').then(m => m.AdminHomeModule),
  },
  {
    path: 'auth',
    loadChildren: (): Promise<typeof AuthModule> =>
      import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'icons',
    loadChildren: (): Promise<typeof IconPageModule> =>
      import('./pages/icon-page/components/icon-page/icon-page.component').then(
        m => m.IconPageModule
      ),
  },
  fallbackRoute,
  {
    path: 'hikes',
    component: HikeListPageComponent,
    data: { redirectIfUnauth: ['auth', 'login'] } as AuthRedirects,
    resolve: { hikes: HikeListResolver },
  },
  // {
  //   path: 'hike/:id',
  //   component: HikeEditorPageComponent,
  //   resolve: { hikePreparingHandled: HikeEditorResolveGuard },
  // },
  // {
  //   path: 'hike-groups',
  //   component: HikeGroupListComponent
  // },
  // {
  //   path: 'hike-group/new',
  //   component: HikeGroupComponent
  // },
  // {
  //   path: 'hike-group/:id',
  //   component: HikeGroupComponent
  // }
  // ],
  // canActivate: [AuthGuard],
  // data: { enabledRole: roles.enabledRoles, unauthRedirect: ['auth', 'login'] }
  // },

  //  },
  //  {
  //    path: 'hike',
  //    loadChildren: (): any =>
  //      import('@bit/garlictech.angular.gtrack.pages/hike-page.component').then(
  //        m => m.HikePageModule
  //      ),
  //  },
  //  {
  //    path: 'poi',
  //    loadChildren: (): any =>
  //      import('@bit/garlictech.angular.gtrack.pages/poi-page.component').then(
  //        m => m.PoiPageModule
  //      ),
  //  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
