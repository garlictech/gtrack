import * as fp from 'lodash/fp';

export const createPagedArrayLimitIndicator = (limit: number): any => {
  let currentValue = 0;

  return {
    addArray: (arr: { id: string }[]) =>
      (currentValue += fp.isArray(arr) ? arr.length : 0),
    limitReached: () => currentValue >= limit,
  };
};
