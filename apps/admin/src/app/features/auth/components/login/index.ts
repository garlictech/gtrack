import { NGXLogger } from 'ngx-logger';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  AuthenticationActions,
  AuthenticationSelectors,
} from '@gtrack/shared/authentication/data-access';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faSpinner, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'gtrack-app-login',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
})
export class LoginComponent implements OnInit {
  loggingIn$: Observable<boolean>;

  faSpinner: IconDefinition;
  faGoogle: IconDefinition;

  constructor(
    private readonly log: NGXLogger,
    private readonly _store: Store,
    private readonly _title: Title
  ) {
    this.loggingIn$ = of(false);

    this.faSpinner = faSpinner;
    this.faGoogle = faGoogle;
  }

  ngOnInit(): void {
    this._title.setTitle('gTrack Login');

    this.loggingIn$ = this._store.pipe(
      select(AuthenticationSelectors.loggingIn)
    );
  }

  login(): void {
    this._store.dispatch(
      AuthenticationActions.googleLogin({ roles: ['admin'] })
    );
  }
}
