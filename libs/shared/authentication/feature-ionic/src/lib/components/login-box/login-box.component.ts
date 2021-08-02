import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import {
  EmailField,
  FormDescriptor,
  SharedFormsFeatureModule,
} from '@gtrack/shared/forms/feature';
import { SharedFormsFeatureIonicModule } from '@gtrack/shared/forms/feature-ionic';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  AuthenticationActions,
  AuthService,
  EAuthRoles,
} from '@gtrack/shared/authentication/data-access';
import { LocalizationSelectors } from '@gtrack/shared/localization/data-access';
import { ModalContainerModule } from '@gtrack/shared/generic-ui/feature-ionic';
import {
  SharedAuthenticationUiIonicModule,
  SocialLoginButtonModule,
} from '@gtrack/shared/authentication/ui-ionic';

@Component({
  selector: 'gtrack-authentication-login-box',
  templateUrl: './login-box.component.html',
})
export class LoginBoxComponent implements OnInit {
  @Input() type: string | undefined;
  @Input() showFacebook = true;
  @Input() showGoogle = true;
  @Input() showApple = true;
  @Input() showMagicLink = true;
  @Input() role = EAuthRoles.user;
  @Input() navLevel = 0;

  formDescriptor!: FormDescriptor;
  termsAndCondSlug$: Observable<string>;
  privacyPolicySlug$: Observable<string>;
  termsChecked: boolean;

  constructor(
    private readonly auth: AuthService,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>
  ) {
    this.termsChecked = false;

    this.termsAndCondSlug$ = this.store
      .select(LocalizationSelectors.currentLanguage)
      .pipe(map(language => `/assets/docs/${language}/termsAndCond.pdf`));

    this.privacyPolicySlug$ = this.store
      .select(LocalizationSelectors.currentLanguage)
      .pipe(map(language => `/assets/docs/${language}/privacyPolicy.pdf`));
  }

  ngOnInit(): void {
    this.formDescriptor = {
      submit: {
        translatableLabel: 'authentication.login',
        submitFv: (formGroup: FormGroup) =>
          this.auth.requestMagicLink(formGroup.value.email, this.role),
        disabled: () => !this.termsChecked,
      },
      fields: {
        email: new EmailField({
          label: 'authentication.magicLink',
          required: true,
          placeholder: 'EMAIL',
        }),
      },
    };
  }

  facebookLoginInitiated(): void {
    this.auth.handleSuccessfulLogin(() =>
      AuthenticationActions.facebookLogin({ roles: [this.role] })
    );
  }

  googleLoginInitiated(): void {
    this.auth.handleSuccessfulLogin(() =>
      AuthenticationActions.googleLogin({ roles: [this.role] })
    );
  }

  appleLoginInitiated(): void {
    this.auth.handleSuccessfulLogin(() =>
      AuthenticationActions.appleLogin({ roles: [this.role] })
    );
  }
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    SharedFormsFeatureIonicModule,
    SocialLoginButtonModule,
    FormsModule,
    ModalContainerModule,
    SharedAuthenticationUiIonicModule,
  ],
  declarations: [LoginBoxComponent],
})
export class LoginBoxComponentModule {}
