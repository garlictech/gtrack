import { LengthUnit } from '../lib';

export interface UnitValue {
  value: number;
  unit: string;
}

export class UnitsFp {
  static convertDistance(
    distanceInMeters: number,
    lengthUnit: LengthUnit,
    noBigUnit = false
  ): UnitValue {
    const distanceValue: UnitValue = {
      value: lengthUnit.convertDistance(distanceInMeters),
      unit: lengthUnit.smallUnit,
    };

    if (distanceInMeters >= 1000 && !noBigUnit) {
      distanceValue.value = lengthUnit.convertDistanceInBigUnit(
        distanceInMeters
      );
      distanceValue.unit = lengthUnit.bigUnit;
    }

    return distanceValue;
  }

  static convertDistanceInBigUnit(
    distanceInMeters: number,
    lengthUnit: LengthUnit
  ): UnitValue {
    return {
      value: lengthUnit.convertDistanceInBigUnit(distanceInMeters),
      unit: lengthUnit.bigUnit,
    };
  }

  static convertBigUnitToMeter(
    distance: number,
    lengthUnit: LengthUnit
  ): number {
    return Math.round(
      distance * lengthUnit.conversionToBig * lengthUnit.conversionToMeter
    );
  }
}
