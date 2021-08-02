export class LengthUnit {
  smallUnit: string;
  bigUnit: string;
  conversionToMeter: number;
  conversionToBig: number;

  convertDistance(meters: number): number {
    return Math.round((meters * 1.0) / this.conversionToMeter);
  }

  convertDistanceInBigUnit(meters: number): number {
    return (
      Math.round(
        (meters * 10.0) / this.conversionToMeter / this.conversionToBig
      ) / 10
    );
  }
}
