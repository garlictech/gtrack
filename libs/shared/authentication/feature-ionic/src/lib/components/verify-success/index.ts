import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationActions } from '@gtrack/shared/authentication/data-access';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

interface SuccessParams {
  token: string;
  uid: string;
}

@Component({
  selector: 'app-verify-success',
  template: '',
})
export class VerifySuccessComponent implements OnInit {
  constructor(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {


    /*   this.route.queryParams.pipe(take(1)).subscribe((params: SuccessParams) => {
        this.store.dispatch(
          new AuthenticationActions.Verify(params.token, params.uid)
        );
      }); */
  }
}
