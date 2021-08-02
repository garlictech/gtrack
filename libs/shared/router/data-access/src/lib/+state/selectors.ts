import * as fromRouter from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { get as _get } from 'lodash';
import { featureName, RouterStateDesc } from './state';

const routerFeatureState = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateDesc>
>(featureName);

export const selectRouteParams = createSelector(routerFeatureState, state =>
  _get(state, 'state.params')
);

export const selectRouteParam = createSelector(
  routerFeatureState,
  (state: any, param: any) => _get(state, `state.params.${param}`)
);

export const selectUrl = createSelector(routerFeatureState, state =>
  _get(state, 'state.url')
);

export const selectRouteData = createSelector(routerFeatureState, state =>
  _get(state, 'state.data')
);
