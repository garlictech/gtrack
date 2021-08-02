import { createAction, props } from '@ngrx/store';
import { SearchFilters } from '../types';

export const ChangeFilters = createAction(
  '[SearchFilters] Change filters',
  props<Partial<SearchFilters>>()
);

export const ResetFilters = createAction('[SearchFilters] Reset filters');

export const SearchingStarted = createAction(
  '[SearchFilters] Searching started'
);

export const SearchingFinished = createAction(
  '[SearchFilters] Searching finished'
);
