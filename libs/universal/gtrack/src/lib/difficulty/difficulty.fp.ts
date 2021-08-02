const difficulties = [
  {
    color: '#00cc00',
    value: 'easy',
  },
  {
    color: '#cccc00',
    value: 'moderate',
  },
  {
    color: '#ff9900',
    value: 'challenging',
  },
  {
    color: '#cc3300',
    value: 'difficult',
  },
  {
    color: '#ff0000',
    value: 'extreme',
  },
];

export class DifficultyFp {
  static getColor(value: number): string {
    return value < difficulties.length ? difficulties[value].color : '#ffffff';
  }

  static getDifficulty(value: number): string | undefined {
    return value < difficulties.length ? difficulties[value].color : undefined;
  }

  static getMaxDifficultyValue(): number {
    return difficulties.length - 1;
  }

  static calculateDifficulty(distanceInMeters: number, uphill: number): number {
    const _score = Math.round(
      (((uphill * 3.2808398950131) / (distanceInMeters * 3.280839895)) * 550 +
        Math.sqrt(distanceInMeters * distanceInMeters * 0.000002316612951)) /
        2.5
    );

    if (_score <= 7) {
      return 0;
    } else if (_score <= 13) {
      return 1;
    } else if (_score <= 18) {
      return 2;
    } else if (_score <= 23) {
      return 3;
    } else {
      return 4;
    }
  }
}
