import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterActions } from '@gtrack/shared/router/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gtrack-auth-start',
  templateUrl: './auth-start.component.html',
  styleUrls: ['./auth-start.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthStartComponent {
  constructor(private _store: Store) {}

  signUp(): void {
    this._store.dispatch(new RouterActions.Go(['auth', 'signup']));
  }

  signIn(): void {
    this._store.dispatch(new RouterActions.Go(['auth', 'signin']));
  }
}
