import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './components/login';
import {
  SharedAuthenticationDataAccessModule,
  NotAuthGuard,
} from '@gtrack/shared/authentication/data-access';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthGuard],
    data: {
      redirectAfterAuthSuccess: ['admin', 'hikes'],
    },
  },
];

const COMPONENTS = [LoginComponent];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
    SharedAuthenticationDataAccessModule
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
})
export class AuthModule {}
