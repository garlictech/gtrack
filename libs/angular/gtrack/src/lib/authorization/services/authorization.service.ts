import { AuthService } from '@gtrack/shared/authentication/data-access';
import { ModalController, Platform } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { identity as I } from 'fp-ts';
import * as fp from 'lodash/fp';
import { Observable, EMPTY, of, from, merge } from 'rxjs';
import {
  filter,
  switchMap,
  switchMapTo,
  take,
  tap,
  share,
  mapTo,
} from 'rxjs/operators';
import { AccessLevel } from '../interfaces';
import * as fromSelectors from '../store/selectors';
import { EAuthRoles } from '@gtrack/shared/authentication/data-access';
import { Injectable } from '@angular/core';
import { LoginBoxComponent } from '@gtrack/shared/authentication/feature-ionic';
import { ModalNavigationComponent } from '@gtrack/shared/generic-ui/feature-ionic';

const isAuthenticated = fp.isEqual(AccessLevel.AUTHENTICATED);
const isBaseTier = fp.isEqual(AccessLevel.BASE_TIER);

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  constructor(
    private readonly _platform: Platform,
    private readonly _authService: AuthService,
    private readonly _store: Store,
    private readonly _modalController: ModalController
  ) {}

  public authorizedCall$(
    fn: () => void,
    level: AccessLevel,
    role: EAuthRoles
  ): Observable<boolean> {
    const isLoggedIn$ = this._isLoggedIn().pipe(filter(I.of), share());
    const isNotLoggedIn$ = this._isLoggedIn().pipe(
      filter(loggedIn => !loggedIn),
      share()
    );

    const handleAuthenticated$ = isLoggedIn$.pipe(tap(fn), switchMapTo(EMPTY));

    const showLogin$ = isNotLoggedIn$.pipe(
      switchMapTo(this._showLoginWindow(role))
    );

    const isSubscribed$ = isLoggedIn$.pipe(
      switchMapTo(this._isSubscribed()),
/*       filter(I.of) 
 */    );

    const isNotSubscribed$ = isLoggedIn$.pipe(
      switchMapTo(this._isSubscribed()),
      filter(isSubscribed => !isSubscribed)
    );

    const handleBaseTier$ = isSubscribed$.pipe(tap(fn), switchMapTo(EMPTY));

    const showPayment$ = isNotSubscribed$.pipe(
      switchMapTo(this._showPaymentWindow())
    );

    const handleAuthenticated = () => merge(handleAuthenticated$, showLogin$);

    const handleBaseTier = () =>
      merge(handleBaseTier$, showLogin$, showPayment$);

    return fp
      .cond([
        [isAuthenticated, handleAuthenticated],
        [isBaseTier, handleBaseTier],
      ])(level)
      .pipe(mapTo(true));
  }

  private _isLoggedIn(): Observable<boolean> {
    return this._authService.isLoggedIn().pipe(take(1), share());
  }

  private _isSubscribed(): Observable<boolean | undefined> {
    const fromPlatform$ = from(this._platform.ready()).pipe(take(1), share());

    const isWeb$ = fromPlatform$.pipe(
      filter(
        () => this._platform.is('desktop') || this._platform.is('mobileweb')
      ),
      take(1),
      mapTo(true)
    );

    const isSubscribed$ = this._store.pipe(
      select(fromSelectors.isSubscribed),
      take(1)
    );

    const isMobile$ = fromPlatform$.pipe(
      filter(
        () => !this._platform.is('desktop') && !this._platform.is('mobileweb')
      ),
      take(1),
      switchMapTo(isSubscribed$)
    );

    return merge(isWeb$, isMobile$).pipe(share());
  }

  private _showLoginWindow(role: EAuthRoles): Observable<boolean> {
    return from(this._modalController.getTop()).pipe(
      switchMap(presentingElement =>
        from(
          this._modalController.create({
            presentingElement,
            componentProps: {
              rootPage: LoginBoxComponent,
              role,
            },
            cssClass: 'gtrack-generic-popover',
            component: ModalNavigationComponent,
            swipeToClose: true,
          })
        )
      ),
      switchMap(modal => from(modal.present())),
      mapTo(true)
    );
  }

  private _showPaymentWindow(): Observable<void> {
    return of(true).pipe(switchMapTo(EMPTY));
  }
}
