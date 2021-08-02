import { NGXLogger } from 'ngx-logger';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalContainerModule,
  ModalContainerComponent,
} from '@gtrack/shared/generic-ui/feature-ionic';
import { CommonSettingsComponentModule } from '../common-settings/common-settings.component';
import { of, Observable } from 'rxjs';
import { LoginBoxComponent } from '@gtrack/shared/authentication/feature-ionic';

@Component({
  selector: 'gtrack-common-settings-modal',
  template: `
    <gtrack-modal-container titleLabel="generic.settings">
      <gtrack-common-settings
        [loginMethod]="loginMethod"
      ></gtrack-common-settings>
    </gtrack-modal-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonSettingsModalComponent {
  loginMethod: () => Observable<boolean>;
  @ViewChild(ModalContainerComponent) modal: ModalContainerComponent;

  constructor(private readonly log: NGXLogger) {
    this.loginMethod = () => {
      this.modal.goForward(LoginBoxComponent);
      return of(true);
    };
  }
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [CommonModule, ModalContainerModule, CommonSettingsComponentModule],
  declarations: [CommonSettingsModalComponent],
  exports: [CommonSettingsModalComponent],
})
export class CommonSettingsModalComponentModule {}
