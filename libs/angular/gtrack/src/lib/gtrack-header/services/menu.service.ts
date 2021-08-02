import { Injectable } from '@angular/core';
import {
  AuthenticationActions,
  AuthenticationSelectors,
} from '@gtrack/shared/authentication/data-access';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { LoginBoxComponent } from '@gtrack/shared/authentication/feature-ionic';

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly alertCtrl: AlertController,
    private readonly tr: TranslateService,
    private modalCtrl: ModalController
  ) {}

  isLoggedIn$(): Observable<boolean> {
    return this.store.select(AuthenticationSelectors.loggedIn);
  }

  async login(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: LoginBoxComponent,
      swipeToClose: true,
    });
    return await modal.present();
  }

  async logout(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: this.tr.instant('authentication.confirmLogoutTitle'),
      message: this.tr.instant('authentication.confirmLogout'),
      buttons: [
        {
          text: this.tr.instant('authentication.logoutCancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            /* EMPTY */
          },
        },
        {
          text: this.tr.instant('authentication.logout'),
          handler: () => {
            this.store.dispatch(new AuthenticationActions.LogoutStart());
          },
        },
      ],
    });

    await alert.present();
  }
}
