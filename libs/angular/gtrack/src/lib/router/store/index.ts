import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as fromRouter from '@ngrx/router-store';
import * as RouterActions from './actions';
import * as RouterSelectors from './selectors';
import { RouterStateDesc } from './state';
export * from './actions';
export * from './effects';
export * from './selectors';
export { RouterActions, RouterSelectors };

export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateDesc> {
  serialize(routerState: RouterStateSnapshot): RouterStateDesc {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params, data } = state;

    return { url, queryParams, params, data };
  }
}
