import { LengthUnit } from './length-unit';

export class Imperial extends LengthUnit {
  smallUnit: string;
  bigUnit: string;
  conversionToMeter: number;
  conversionToBig: number;

  constructor() {
    super();

    this.smallUnit = 'yd.';
    this.bigUnit = 'mi.';
    this.conversionToMeter = 0.9144;
    this.conversionToBig = 1760;
  }
}
