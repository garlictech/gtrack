import { CommonModule } from '@angular/common';
import { NgModule, Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ModalController, IonicModule, IonNav } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'gtrack-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss'],
})
export class ModalContainerComponent {
  @Input() titleLabel?: string;
  @Input() navLevel = 0;

  rootPage: any;

  constructor(
    private readonly modalController: ModalController,
    private readonly nav: IonNav
  ) {}

  // Components are with decorators, so there is no such thing like generic Component type :(
  // so here we have to use any
  //
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  goForward(component: any): void {
    this.nav.push(component, { navLevel: this.navLevel + 1 });
  }

  dismiss(): void {
    this.modalController.dismiss();
  }
}

@NgModule({
  declarations: [ModalContainerComponent],
  imports: [IonicModule, TranslateModule, CommonModule],
  exports: [ModalContainerComponent],
})
export class ModalContainerModule {}
