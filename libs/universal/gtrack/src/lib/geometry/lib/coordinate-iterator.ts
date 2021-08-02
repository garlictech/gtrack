import {
  first as _first,
  isEqual,
  last as _last,
  round as _round,
} from 'lodash';
import { Position } from '@turf/helpers';

export class CoordinateIterator {
  protected index: number;
  protected loop: boolean;
  protected _coordinates?: Position[];

  constructor(coordinates: Position[]) {
    this.coordinates = coordinates;
    this.start();

    this.index = 0;
    this.loop = false;
  }

  set coordinates(coordinates: Position[]) {
    this._coordinates = coordinates;
    this.loop = this.isLoop();
  }

  get coordinates(): Position[] {
    return this._coordinates ?? [];
  }

  start(index = 0): Position {
    this.index = index;

    return this.coordinates[index] || undefined;
  }

  next(): Position | undefined {
    let next: Position | undefined;

    if (this.coordinates) {
      this.index++;
      next = this.coordinates[this.index] || undefined;

      if (this.index === this.coordinates.length - 1 && this.loop) {
        next = this.start();
      }
    }

    return next;
  }

  at(): number {
    return this.index;
  }

  end(): boolean {
    return this.index >= this.coordinates.length;
  }

  protected isLoop(): boolean {
    let isLoop = false;
    const round = (numbers: number[]): number[] =>
      numbers.map((n: number) => _round(n, 6));

    const first = _first(this.coordinates);
    const last = _last(this.coordinates);

    if (first && last) {
      isLoop = isEqual(round(first), round(last));
    }

    return isLoop;
  }
}
