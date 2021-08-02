import { NGXLogger } from 'ngx-logger';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Platform, AlertController } from '@ionic/angular';
import {
  InAppPurchase2,
  IAPProduct,
} from '@ionic-native/in-app-purchase-2/ngx';
import { log } from '@app/log';
import { Store, select } from '@ngrx/store';
import * as I from 'fp-ts/lib/Identity';
import { from, Observable, EMPTY } from 'rxjs';
import {
  take,
  shareReplay,
  tap,
  map,
  switchMapTo,
  filter,
  switchMap,
} from 'rxjs/operators';
import * as fromActions from '../store/actions';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthorizationActions,
  AuthorizationSelectors,
} from '@bit/garlictech.angular.gtrack.authorization/store';

const { Device } = Plugins;
const YEARLY_BASIC_SUBSCRIPTION_ID = '1';

@Injectable({
  providedIn: 'root',
})
export class InAppPurchaseService {
  constructor(
    private readonly log: NGXLogger,
    private readonly _platform: Platform,
    private readonly _alertController: AlertController,
    private readonly _inAppStore: InAppPurchase2,
    private readonly _store: Store,
    private readonly _tr: TranslateService
  ) {
    this._init().subscribe();
  }

  public restore(): void {
    this._inAppStore.refresh();
  }

  public purchase(product: IAPProduct): void {
    this._inAppStore.order(product).then(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_p: any) => {
        // purchase in progress
      },
      (err: any) => {
        this._presentAlert('Failed', `Failed to purchase: ${err}`).subscribe();
      }
    );
  }

  public checkDevice(): Observable<boolean> {
    return from(Device.getInfo()).pipe(
      take(1),
      shareReplay(1),
      tap(info => this.log.info('Device info: ', info)),
      map(({ platform }) => platform === 'ios' || platform === 'android')
    );
  }

  public isSubscribed(): Observable<boolean> {
    return this._store.pipe(select(AuthorizationSelectors.isSubscribed));
  }

  private _init(): Observable<boolean> {
    return from(this._platform.ready()).pipe(
      switchMapTo(this.checkDevice()),
      take(1),
      filter(I.of),
      tap(() => {
        this._inAppStore.verbosity = this._inAppStore.DEBUG;
        this._registerProducts();
        this._setupListeners();
        this.restore();
      })
    );
  }

  private _registerProducts(): void {
    this._inAppStore.register({
      id: YEARLY_BASIC_SUBSCRIPTION_ID,
      type: this._inAppStore.PAID_SUBSCRIPTION,
    });
  }

  private _setupListeners(): void {
    this._inAppStore
      .when('product')
      .approved((product: IAPProduct) => {
        return product.verify();
      })
      .verified((product: IAPProduct) => product.finish());

    this._inAppStore.when(YEARLY_BASIC_SUBSCRIPTION_ID).owned(() => {
      this._store.dispatch(AuthorizationActions.setSubscription());
    });

    this._inAppStore
      .when('product')
      .registered((product: IAPProduct) => {
        this.log.info(`Registered: ${JSON.stringify(product)}`);
      })
      .updated((product: IAPProduct) => {
        this.log.info(`Updated: ${JSON.stringify(product)}`);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .cancelled((_: any) => {
        this.log.error('Purchase was Cancelled');
      });

    this._inAppStore.error((err: any) => {
      this.log.error(`Store Error: ${JSON.stringify(err)}`);
    });

    this._inAppStore.ready(() => {
      this.log.info('Store is ready');
      this._store.dispatch(
        fromActions.setProducts({ payload: this._inAppStore.products })
      );
    });
  }

  private _presentAlert(header: string, message: string): Observable<void> {
    return this._tr.get('common.ok').pipe(
      switchMap(okBtn =>
        from(
          this._alertController.create({
            header,
            message,
            buttons: [okBtn],
          })
        )
      ),
      switchMap(alert => from(alert.present()).pipe(switchMapTo(EMPTY)))
    );
  }
}
