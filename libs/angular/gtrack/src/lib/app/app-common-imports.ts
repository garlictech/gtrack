import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { gTrackEntityConfig } from '@bit/garlictech.angular.gtrack.gtrack-data';
import { IonicModule } from '@ionic/angular';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ActionReducer } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { SharedAuthenticationDataAccessModule } from '@gtrack/shared/authentication/data-access';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import {
  routerModuleConfig,
  RouterModule,
} from '@bit/garlictech.angular.gtrack.router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { pageTransition } from './animation';
import { CustomerStoreModule } from '@bit/garlictech.angular.gtrack.customer/store/customer-store.module';
import { SharedLocalizationDataAccessModule } from '@gtrack/shared/localization/data-access';
import { SharedGenericUiDataAccessModule } from '@gtrack/shared/generic-ui/data-access';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

// eslint:disable-next-line: only-arrow-functions
export function logger(_reducer: ActionReducer<unknown>): any {
  return storeLogger({
    collapsed: true,
  })(_reducer);
}

const metaReducers = [logger];
//const metaReducers = [...authMetaReducers];

// eslint:disable-next-line:only-arrow-functions
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

export { SharedLocalizationDataAccessModule } from '@gtrack/shared/localization/data-access';
export { metaReducers };

// No idea why I have to export it. It solves the error:
// ERROR in SymbolSharedLocalizationDataAccessModule declared in /Users/molnarzs/ActualProjects/gtrack/gtrack/packages/lib/angular/shared/localization/localization.module.ts is not exported from @bit/garlictech.angular.gtrack.app (import into /Users/molnarzs/ActualProjects/gtrack/gtrack/packages/app/src/app/app.module.ts
export const appCommonImports = [
  BrowserModule,
  BrowserAnimationsModule,
  IonicModule.forRoot({
    menuType: 'overlay',
    backButtonText: 'back',
    rippleEffect: false,
    animated: true,
    navAnimation: pageTransition,
  }),
  LoggerModule.forRoot({
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.ERROR,
  }),
  EffectsModule.forRoot([]),
  EntityDataModule.forRoot(gTrackEntityConfig),
  StoreRouterConnectingModule.forRoot(routerModuleConfig),
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: createTranslateLoader,
      deps: [HttpClient],
    },
  }),
  HttpClientModule,
  SharedLocalizationDataAccessModule.forRoot(),
  AngularSvgIconModule.forRoot(),
  RouterModule,
  SharedGenericUiDataAccessModule,
  SharedAuthenticationDataAccessModule,
  CustomerStoreModule,
];
