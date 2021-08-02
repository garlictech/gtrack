import { NGXLogger } from 'ngx-logger';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Plugins, PermissionType } from '@capacitor/core';
import { RouterOutlet } from '@angular/router';

const { SplashScreen, Permissions } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private previousPath = '';

  constructor(
    private readonly log: NGXLogger,
    private platform: Platform,
    private changeRef: ChangeDetectorRef
  ) {
    this.log.info(
      'AppComponent().constructor(private readonly log: NGXLogger,)'
    );
    this.initializeApp();
  }
  ngAfterViewChecked(): void {
    this.changeRef.detectChanges();
  }

  getPageTransition(routerOutlet: RouterOutlet): string {
    if (routerOutlet.isActivated) {
      let transitionName = 'section';

      const { path } = routerOutlet.activatedRoute.routeConfig;
      const isSame = this.previousPath === path;
      const isBackward = this.previousPath.startsWith(path);
      const isForward = path.startsWith(this.previousPath);

      if (isSame) {
        transitionName = 'none';
      } else if (isBackward && isForward) {
        transitionName = 'initial';
      } else if (isBackward) {
        transitionName = 'backward';
      } else if (isForward) {
        transitionName = 'forward';
      }

      this.previousPath = path;

      return transitionName;
    }
  }

  initializeApp(): void {
    this.platform.ready().then(() => {
      setTimeout(
        () =>
          SplashScreen.hide({
            fadeOutDuration: 200,
          }),
        1000
      );

      this.log.debug('App initialized.');

      Permissions.query({
        name: PermissionType.Geolocation,
      }).then(permissionStatus =>
        this.log.debug('Geo location permission status:', permissionStatus)
      );

      // this.initDeepLink();
    });
  }

  // private initDeepLink() {
  //   this.deeplinks.route({}).subscribe(
  //     match => {
  //       this.log.info('DeepLink successfully matched route=' + match);
  //     },
  //     nomatch => {
  //       if (nomatch && nomatch.$link) {
  //         const data = {
  //           url: nomatch.$link.url,
  //           scheme: nomatch.$link.scheme,
  //           query: nomatch.$link.queryString,
  //         };

  //         if (data.scheme && 'gtrack' === data.scheme && data.query) {
  //           const params: string[] = data.query.split('=');
  //           if (params.length > 1) {
  //             const code = params[1];
  //             document.location.href = 'http://localhost:8100/?code=' + code;
  //           }
  //         }
  //       }
  //     }
  //   );
  // }
}
