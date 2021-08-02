/* import { GeojsonPointType } from '@bit/garlictech.universal.gtrack.geometry';
import {
  LengthUnit,
  Metric,
  UnitsFp,
} from '@bit/garlictech.universal.gtrack.units';
import distance from '@turf/distance';
import { Point, Position } from '@turf/helpers';
import { max as d3max, min as d3min } from 'd3-array';
import {
  ScaleLinear as D3ScaleLinear,
  scaleLinear as d3ScaleLinear,
} from 'd3-scale';
import {
  Area as D3Area,
  area as d3Area,
  curveBasis as d3CurveBasis,
  Line as D3Line,
  line as d3Line,
} from 'd3-shape';

export const defaultMargins: ElevationMargin = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

interface ElevationMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface ElevationData {
  highestElevation: number;
  lowestElevation: number;
  xRange: D3ScaleLinear<number, number>;
  yRange: D3ScaleLinear<number, number>;
  lineData: [number, number][];
  lineFunc: D3Line<[number, number]>;
  areaFunc: D3Area<[number, number]>;
}

export class ElevationProfileD3 {
  static getd3ElevationData(
    coordinates: GeojsonPointType[],
    width: number,
    height: number,
    lengthUnit: LengthUnit,
    margins = defaultMargins
  ): ElevationData | undefined {
    const lineData: [number, number][] = [];
    let dist = 0;

    coordinates.forEach((coordinate: Position, i: number) => {
      let previous: Position;

      if (i === 0) {
        lineData.push([
          0,
          UnitsFp.convertDistance(coordinate[2], lengthUnit, true).value,
        ]);
      } else {
        previous = coordinates[i - 1];

        const previousPoint: Point = {
          type: 'Point',
          coordinates: [previous[0], previous[1]],
        };

        const currentPoint: Point = {
          type: 'Point',
          coordinates: [coordinate[0], coordinate[1]],
        };

        dist += distance(currentPoint, previousPoint) * 1000;

        lineData.push([
          UnitsFp.convertDistanceInBigUnit(dist, lengthUnit).value,
          UnitsFp.convertDistance(coordinate[2], lengthUnit, true).value,
        ]);
      }
    });

    const xRangeMin = d3min(lineData, d => d[0]);
    const xRangeMax = d3max(lineData, d => d[0]);
    const yRangeMin = d3min(lineData, d => d[1]);
    const yRangeMax = d3max(lineData, d => d[1]);

    if (typeof xRangeMin === 'undefined' || typeof xRangeMax === 'undefined') {
      return undefined;
    }

    const xRange: D3ScaleLinear<number, number> = d3ScaleLinear()
      .range([margins.left, width - margins.right])
      .domain([xRangeMin, xRangeMax]);

    if (typeof yRangeMin === 'undefined' || typeof yRangeMax === 'undefined') {
      return undefined;
    }

    const yGridUnit = (yRangeMax - yRangeMin) / 10;

    // The human factor: if the hike is flat (variation is only a couple of meters), we flatten the elevation profile
    // to make the users sense this fact.
    // So, if the altitude difference between the top/bottom points is less than 400m, we gradually introduce a compression
    // of the graph. After 400 m, the graph is intact.
    const compressionConstant = UnitsFp.convertDistance(400, lengthUnit, true)
      .value;
    const compressionParameter = Math.max(
      (compressionConstant - (yRangeMax - yRangeMin)) / 2,
      0
    );

    const yRange: D3ScaleLinear<number, number> = d3ScaleLinear()
      .range([height - margins.top, margins.bottom])
      .domain([
        yRangeMin - yGridUnit - compressionParameter,
        yRangeMax + yGridUnit + compressionParameter,
      ]);

    return {
      highestElevation: yRangeMax,
      lowestElevation: yRangeMin,
      xRange,
      yRange,
      lineData,
      lineFunc: d3Line() 
        .x(d => xRange(d[0]))
        .y(d => yRange(d[1]))
         .curve(d3CurveBasis),
       areaFunc: d3Area()
        .x(d => xRange(d[0]))
        .y0(height - margins.bottom)
        .y1(d => yRange(d[1]))
        .curve(d3CurveBasis),
    };
  }

  static getd3ElevationDataInMeters(
    coordinates: GeojsonPointType[],
    width: number,
    height: number,
    margins = defaultMargins
  ): ElevationData | undefined {
    return ElevationProfileD3.getd3ElevationData(
      coordinates,
      width,
      height,
      new Metric(),
      margins
    );
  }
}
 */