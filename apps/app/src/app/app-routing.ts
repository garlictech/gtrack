import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'hike/:id',
    redirectTo: '/tabs/home/hike/:id',
    pathMatch: 'full',
  },
  {
    path: 'search',
    redirectTo: '/tabs/home/search',
    pathMatch: 'full',
  },
  {
    path: 'poi/:id',
    redirectTo: '/tabs/home/poi/:id',
    pathMatch: 'full',
  },
  {
    path: 'documents/:id',
    redirectTo: '/tabs/home/documents',
  },
  {
    path: '',
    loadChildren: (): any =>
      import('./tabs/tabs.module').then(m => m.TabsModule),
  },
];
