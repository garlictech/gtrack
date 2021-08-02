import { NgModule, Component } from '@angular/core';

import { ModalController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'gtrack-modal-navigation',
  template: ` <ion-nav [root]="rootPage"></ion-nav> `,
})
export class ModalNavigationComponent {
  rootPage: any;
  constructor(private readonly modalController: ModalController) {}

  dismiss(): void {
    this.modalController.dismiss();
  }
}

@NgModule({
  declarations: [ModalNavigationComponent],
  imports: [IonicModule],
  exports: [ModalNavigationComponent],
})
export class ModalNavigationModule {}
