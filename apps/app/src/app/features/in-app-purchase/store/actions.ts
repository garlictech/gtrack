import { IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { createAction, props } from '@ngrx/store';

export enum InAppPurchaseActionTypes {
  SET_PRODUCTS = '[InAppPurchase] Set products',
  RESET_PRODUCTS = '[InAppPurchase] Reset products',
}

export const setProducts = createAction(
  InAppPurchaseActionTypes.SET_PRODUCTS,
  props<{ payload: IAPProduct[] }>()
);

export const resetProducts = createAction(
  InAppPurchaseActionTypes.RESET_PRODUCTS
);
