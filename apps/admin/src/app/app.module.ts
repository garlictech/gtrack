import { SearchModule } from '@bit/garlictech.angular.gtrack.search';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ExternalPoisModule } from '@admin/features/external-pois';
import { HikeEditorModule } from './features/hike-editor/hike-editor.module';
import { WaypointMarkersModule } from './features/waypoint-markers';
import { HikeEditorPageModule } from './pages/hike-editor/hike-editor.component';
import { environment } from '../environments/environment';
import {
  appCommonImports,
  metaReducers,
} from '@bit/garlictech.angular.gtrack.app';

import { ServiceWorkerModule } from '@angular/service-worker';
import { RoutePlannerStoreModule } from './features/route-planner';
import { NotFound404Component } from './not-found404.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TransferState } from '@angular/platform-browser';
import { appCommonProviders } from '@bit/garlictech.angular.gtrack.app';
import { appPlatformConfig } from './app-platform-config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbThemeModule,
  NbLayoutModule,
  NbSidebarModule,
  NbSidebarService,
  NbMenuModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppRoutingModule } from './app-routing.module';
import { MenuModule } from './core/components/menu/index';
import {
  AUTHENTICATION_PLATFORM,
  CognitoAuthService,
} from '@gtrack/shared/authentication/data-access';

export { SharedLocalizationDataAccessModule } from '@gtrack/shared/localization/data-access';

@NgModule({
  declarations: [AppComponent, NotFound404Component],
  providers: [
    ...appCommonProviders(appPlatformConfig, environment),
    TransferState,
    NbSidebarService,
    { provide: AUTHENTICATION_PLATFORM, useClass: CognitoAuthService },
  ],
  imports: [
    appCommonImports,
    StoreModule.forRoot(
      {},
      {
        metaReducers,
        runtimeChecks: environment.production
          ? undefined
          : {
              strictStateImmutability: true,
              strictActionImmutability: true,
              strictStateSerializability: true,
              strictActionSerializability: true,
            },
      }
    ),
    StoreDevtoolsModule.instrument({
      maxAge: 100,
      name: 'gTrack admin',
      logOnly: environment.production,
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    HikeEditorPageModule,
    RoutePlannerStoreModule,
    WaypointMarkersModule,
    ExternalPoisModule,
    HikeEditorModule,
    SearchModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'custom-theme' }),
    NbLayoutModule,
    NbEvaIconsModule,
    AppRoutingModule,
    NbSidebarModule,
    NbMenuModule.forRoot(),
    MenuModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
