import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CognitoMobileAuthService } from '@app/features/authentication/services/cognito-auth.service';
/* import { AuthenticationCognitoModule } from '@gtrack/shared/authentication/data-access';
 */import { DeviceModule } from '@bit/garlictech.angular.gtrack.device';
import { MobileAuthenticationModule } from './features/authentication';
import { environment } from '../environments/environment';
import {
  appCommonImports,
  metaReducers,
} from '@bit/garlictech.angular.gtrack.app';
import { StoreModule } from '@ngrx/store';

import { RouterModule, PreloadAllModules } from '@angular/router';
import { routes } from './app-routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { ErrorHandler } from '@angular/core';
import { MobileErrorHandler } from '@app/app.error-handler';
import { appPlatformConfig } from './app-platform-config';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { appCommonProviders } from '@bit/garlictech.angular.gtrack.app';

@NgModule({
  declarations: [AppComponent],
  providers: [
    ...appCommonProviders(appPlatformConfig, environment),
    InAppPurchase2,
    { provide: ErrorHandler, useClass: MobileErrorHandler },
  ],
  imports: [
    appCommonImports,
/*     AuthenticationCognitoModule.forRoot(CognitoMobileAuthService as any),
 */    BrowserAnimationsModule,
    MobileAuthenticationModule,
    DeviceModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' }),
    StoreModule.forRoot({} as any, {
      metaReducers,
      runtimeChecks: environment.production
        ? undefined
        : {
            strictStateImmutability: true,
            strictActionImmutability: true,
            strictStateSerializability: true,
            strictActionSerializability: true,
          },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      name: 'gTrack app',
      logOnly: environment.production,
    }),
    erviceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
