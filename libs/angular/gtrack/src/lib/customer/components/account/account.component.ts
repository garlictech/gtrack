import { NGXLogger } from 'ngx-logger';
import {
  NgModule,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'gtrack-common-settings-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  @Input() account?: Account;
  @Input() isLoggedIn: boolean | null;

  @Output() login = new EventEmitter<boolean>();
  @Output() logout = new EventEmitter<boolean>();

  onLogin(): void {
    this.login.emit(true);
  }

  onLogout(): void {
    this.logout.emit(true);
  }
}

@NgModule({
  declarations: [AccountComponent],
  imports: [TranslateModule, CommonModule, IonicModule],
  exports: [AccountComponent],
  providers: [],
})
export class AccountComponentModule {}
