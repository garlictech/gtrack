import { Observable, from } from 'rxjs';

import { share, pluck, filter, switchMap, mapTo } from 'rxjs/operators';
import { select } from '@ngrx/store';
import {
  AuthenticationSelectors,
  User,
} from '@gtrack/shared/authentication/data-access';
import { Store } from '@ngrx/store';
import { EAuthRoles } from '@gtrack/shared/authentication/data-access';
import { MenuService } from '@bit/garlictech.angular.gtrack.gtrack-header/services/menu.service';
import {
  CustomerSelectors,
  CommonSettingsModalComponent,
} from '@bit/garlictech.angular.gtrack.customer';

import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalNavigationComponent } from '@gtrack/shared/generic-ui/feature-ionic';

@Injectable({
  providedIn: 'root',
})
export class HeaderControllerService {
  isLoggedIn$: Observable<boolean>;
  userId$: Observable<string>;
  profilePicture$: Observable<string | null | undefined>;
  role = EAuthRoles.user;

  constructor(
    private readonly menuService: MenuService,
    private store: Store,
    private readonly modalController: ModalController
  ) {
    this.isLoggedIn$ = this.menuService.isLoggedIn$();

    this.profilePicture$ = this.store.select(
      CustomerSelectors.selectProfilePicture
    );

    this.userId$ = this.store.pipe(
      select(AuthenticationSelectors.selectUser),
      filter((user?: User)  => !!user),
      pluck<User | undefined, string>('id'),
      share()
    );
  }

  login(): void {
    this.menuService.login();
  }

  logout(): void {
    this.menuService.logout();
  }

  showSettings(
    presentingElement: HTMLIonRouterOutletElement
  ): Observable<boolean> {
    return from(
      this.modalController.create({
        component: ModalNavigationComponent,
        presentingElement,
        componentProps: {
          rootPage: CommonSettingsModalComponent,
        },
        cssClass: 'gtrack-generic-popover',
      })
    ).pipe(
      switchMap(modal => from(modal.present())),
      mapTo(true)
    );
  }
}
