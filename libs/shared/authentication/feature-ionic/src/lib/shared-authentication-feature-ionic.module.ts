import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EmailSentComponent } from './components/email-sent';
import { PasswordlessSuccessComponent } from './components/passwordless-success';
import { VerifySuccessComponent } from './components/verify-success';
import { SharedAuthenticationDataAccessModule } from '@gtrack/shared/authentication/data-access';
import { AuthStartComponent } from './components/auth-start/auth-start.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AuthStartComponent,
    EmailSentComponent,
    PasswordlessSuccessComponent,
    VerifySuccessComponent,
  ],
  imports: [
    IonicModule,
    TranslateModule,
    SharedAuthenticationDataAccessModule,
    HttpClientModule,
  ],
})
export class SharedAuthenticationFeatureIonicModule {}
