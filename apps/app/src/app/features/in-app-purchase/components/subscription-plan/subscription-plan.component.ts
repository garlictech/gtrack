import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { InAppPurchaseService } from '../../services';
import * as fromSelectors from '../../store/selectors';

@Component({
  selector: 'gtrack-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionPlanComponent {
  public isSubscribed$: Observable<boolean>;
  public products$: Observable<IAPProduct[]>;
  public storeAvailable$: Observable<boolean>;

  constructor(
    private readonly _iapService: InAppPurchaseService,
    private readonly _store: Store
  ) {
    //this.isSubscribed$ = this._store.pipe(select(fromSelectors.isSubscribed));
    this.products$ = this._store.pipe(select(fromSelectors.selectProducts));
    this.storeAvailable$ = this._iapService.checkDevice().pipe(take(1));
  }

  public restore(): void {
    this._iapService.restore();
  }

  public purchase(product: IAPProduct): void {
    this._iapService.purchase(product);
  }
}
