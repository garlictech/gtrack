import * as fp from 'lodash/fp';

export const ifElse = (
  a: (arg0: unknown) => any,
  b: (arg0: unknown) => any,
  c: (arg0: unknown) => any
) => (data: unknown): any => (a(data) ? b(data) : c(data));

export interface Pair<T> {
  current?: T;
  next?: T;
}

// The "next" part of the last pair is always undefined!
export function pairwise<T>(arr: T[]): Pair<T>[] {
  const res: Pair<T>[] = [];

  for (let i = 0; i < arr.length; i++) {
    res.push({ current: arr[i], next: arr[i + 1] });
  }

  return res;
}

export function checkIfPairsAreObjects<T>(pair: Pair<T>): boolean {
  return fp.flow(
    fp.mapValues(fp.isObject),
    fp.values,
    fp.every(fp.identity)
  )(pair);
}

export const convertMinutesToMilliseconds = fp.multiply(60000);
