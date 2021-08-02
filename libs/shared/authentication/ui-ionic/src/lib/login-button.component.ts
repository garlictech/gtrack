import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  faApple,
  IconDefinition,
  faFacebookF,
  faGoogle,
} from '@fortawesome/free-brands-svg-icons';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

type ButtonDesc = {
  onClick: EventEmitter<boolean>;
  icon: IconDefinition;
  backgroundColor: string;
  label: string;
};

@Component({
  selector: 'gtrack-login-button',
  template: `
    <ion-button
      expand="block"
      (click)="handleClick()"
      [disabled]="disabled"
      [style.--background]="desc?.backgroundColor"
      [style.--color]="'white'"
    >
    <!--  <span class="inline-block w-8">
        <fa-icon [icon]="desc?.icon"></fa-icon>
      </span>
      <span> {{ desc?.label | translate }}</span> -->
    </ion-button>
  `,
})
export class LoginButtonComponent {
  @Input() desc?: ButtonDesc;
  @Input() disabled = false;

  handleClick(): void {
    this.desc?.onClick.emit(true);
  }
}

@Component({
  selector: 'gtrack-apple-login-button',
  template: `<gtrack-login-button
    [disabled]="disabled"
    [desc]="desc"
  ></gtrack-login-button>`,
})
export class AppleLoginButtonComponent {
  desc: ButtonDesc = {
    onClick: new EventEmitter<boolean>(),
    icon: faApple,
    backgroundColor: 'black',
    label: 'authentication.appleLink',
  };

  @Input() disabled = false;
  @Output() onClick = this.desc.onClick;
}

@Component({
  selector: 'gtrack-facebook-login-button',
  template: `<gtrack-login-button
    [disabled]="disabled"
    [desc]="desc"
  ></gtrack-login-button>`,
})
export class FacebookLoginButtonComponent {
  desc: ButtonDesc = {
    onClick: new EventEmitter<boolean>(),
    icon: faFacebookF,
    backgroundColor: '#4267b2',
    label: 'authentication.facebookLink',
  };

  @Input() disabled = false;
  @Output() onClick = this.desc.onClick;
}

@Component({
  selector: 'gtrack-google-login-button',
  template: `<gtrack-login-button
    [desc]="desc"
    [disabled]="disabled"
  ></gtrack-login-button>`,
})
export class GoogleLoginButtonComponent {
  desc: ButtonDesc = {
    onClick: new EventEmitter<boolean>(),
    icon: faGoogle,
    backgroundColor: '#da3125',
    label: 'authentication.googleLink',
  };

  @Input() disabled = false;

  @Output() onClick = this.desc.onClick;
}

@NgModule({
  imports: [IonicModule, FontAwesomeModule, TranslateModule, CommonModule],
  declarations: [
    LoginButtonComponent,
    AppleLoginButtonComponent,
    FacebookLoginButtonComponent,
    GoogleLoginButtonComponent,
  ],
  exports: [
    GoogleLoginButtonComponent,
    AppleLoginButtonComponent,
    FacebookLoginButtonComponent,
  ],
})
export class SocialLoginButtonModule { }
