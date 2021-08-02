import { Position } from '@turf/helpers';

const calculateHill = (
  data: number[][],
  bigEnough: (diff: number) => boolean,
  multiplier = 1
): number => {
  let sum = 0;

  data.forEach((point, i) => {
    if (i > 0) {
      const diff = point[2] - data[i - 1][2];

      if (bigEnough(diff)) {
        sum += diff * multiplier;
      }
    }
  });

  return sum;
};

export class ElevationFp {
  static calculateUphill(data: Position[]): number {
    return calculateHill(data, diff => diff > 0);
  }

  static calculateDownhill(data: Position[]): number {
    return calculateHill(data, diff => diff < 0, -1);
  }
}
