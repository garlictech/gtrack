import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CognitoMobileAuthService } from '@app/features/authentication/services/cognito-auth.service';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicModule } from '@ionic/angular';
import {
  AmplifyAngularModule,
  AmplifyIonicModule,
  AmplifyService,
} from 'aws-amplify-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule,
    AmplifyAngularModule,
    AmplifyIonicModule,
  ],
  providers: [AmplifyService, CognitoMobileAuthService],
})
export class MobileAuthenticationModule {}
