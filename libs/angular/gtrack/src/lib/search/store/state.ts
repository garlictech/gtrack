import { SearchFilters } from '../types';

export const featureName = 'features.common.search';

export interface SearchState {
  filters: SearchFilters;
  isSearching: boolean;
}
