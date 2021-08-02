import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationActions } from '@gtrack/shared/authentication/data-access';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

// interface SuccessParams {
//   token: string;
//   uid: string;
//   roles: string;
// }

@Component({
  selector: 'app-passwordless-success',
  template: '',
})
export class PasswordlessSuccessComponent implements OnInit {
  constructor(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(filter(params => !!params))
      .subscribe(params => {
        this.store.dispatch(
          new AuthenticationActions.MagicLinkLogin(params.secret, '', ['user'])
        );
      });
    // this.route.queryParams.pipe(filter(params => params && params.roles)).subscribe((params: SuccessParams) => {
    //   this.store.dispatch(new Actions.MagicLinkLogin(params.token, params.uid, params.roles.split(',')));
    // });
  }
}
