/* eslint no-console: "off" */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Environment } from '@bit/garlictech.angular.gtrack.environment';

export const gtrackBootstrap = (
  environment: Environment,
  appModule: any
): void => {
  if (environment.production) {
    enableProdMode();
  }

  const bootstrap = () => platformBrowserDynamic().bootstrapModule(appModule);

  /*if (environment.hmr) {
    if ((module as any).hot) {
      hmrBootLoader(() =>
        bootstrap()
          .then(ngModuleRef => {
            return hmrModule(ngModuleRef, module);
          })
          .catch(err => console.log(err))
      );
    } else {
      console.error('HMR is not enabled for webpack-dev-server!');
      console.log('Are you using the --hmr flag for ng serve?');
    }
  } else {*/
  bootstrap().catch(err => console.log(err));
  //}

  defineCustomElements(window);
};
