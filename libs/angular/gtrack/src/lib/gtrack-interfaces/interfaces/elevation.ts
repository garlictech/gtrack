import { ScaleLinear } from 'd3-scale';
import { Area, Line } from 'd3-shape';

export interface ElevationData {
  highestElevation: number;
  lowestElevation: number;
  xRange: ScaleLinear<number, number>;
  yRange: ScaleLinear<number, number>;
  lineData: [number, number][];
  lineFunc: Line<[number, number]>;
  areaFunc: Area<[number, number]>;
}

export interface ElevationMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
