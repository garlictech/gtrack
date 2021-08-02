import { NgModule } from '@angular/core';
/* import { AuthenticationCognitoModule } from '@gtrack/shared/authentication/data-access';
 */import {
  appCommonImports,
  metaReducers,
} from '@bit/garlictech.angular.gtrack.app';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { routes } from './app-routing';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { TransferState } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { appCommonProviders } from '@bit/garlictech.angular.gtrack.app';
import { appPlatformConfig } from './app-platform-config';
import { NotFound404Component } from './not-found404.component';

@NgModule({
  declarations: [AppComponent, NotFound404Component],
  providers: [
    ...appCommonProviders(appPlatformConfig, environment),
    TransferState,
  ],
  imports: [
    appCommonImports,
    BrowserAnimationsModule,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    StoreModule.forRoot({} as any, {
      metaReducers,
      runtimeChecks: environment.production
        ? undefined
        : {
            strictStateImmutability: true,
            strictActionImmutability: true,
            strictStateSerializability: true,
            strictActionSerializability: true,
            strictActionWithinNgZone: true,
          },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 50,
      name: 'gTrack website',
      logOnly: environment.production,
    }),
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' }),
/*     AuthenticationCognitoModule.forRoot(),
 */  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
