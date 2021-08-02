import { Injectable } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { from, Subscription, timer } from 'rxjs';
import { PoiStampComponent } from './poi-stamp.component';
import {
  switchMapTo,
  take,
  tap,
  combineLatest,
  finalize,
} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PoiStampService {
  constructor(
    private readonly platform: Platform,
    private readonly modalController: ModalController
  ) {}

  show(title: string, iconType: string): Subscription {
    let modal;

    return from(this.platform.ready())
      .pipe(
        switchMapTo(
          from(
            this.modalController.create({
              component: PoiStampComponent,
              mode: 'ios',
              animated: false,
              swipeToClose: true,
              backdropDismiss: true,
              keyboardClose: false,
              cssClass: 'animation-modal',
              componentProps: {
                title,
                iconType,
              },
            })
          )
        ),
        take(1),
        tap(_modal => {
          modal = _modal;
          modal.present();
        }),
        combineLatest(timer(7000)),
        finalize(() => modal.dismiss())
      )
      .subscribe();
  }
}
