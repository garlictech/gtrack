import { lineString as turfLineString } from '@turf/helpers';
import { nearestPointOnLine } from '@turf/turf';
import { CoordinateIterator } from './coordinate-iterator';
import { Feature, Point, LineString } from '@turf/helpers';

export class CircleSlice {
  constructor(
    private readonly startPoint: Feature<Point>,
    private readonly endPoint: Feature<Point>,
    private readonly line: Feature<LineString>
  ) {}

  get(): Feature<LineString> | null {
    const startVertex = nearestPointOnLine(this.line, this.startPoint);
    const stopVertex = nearestPointOnLine(this.line, this.endPoint);
    const property = 'index';

    if (
      startVertex === null ||
      stopVertex === null ||
      this.line === null ||
      startVertex.geometry === null ||
      stopVertex.geometry === null ||
      this.line.geometry === null
    ) {
      return null;
    }

    const clipLine = turfLineString([
      startVertex.geometry.coordinates,
    ]) as Feature<LineString>;

    if (clipLine === null || clipLine.geometry === null) {
      return null;
    }

    const it = new CoordinateIterator(this.line.geometry.coordinates);

    it.start(startVertex.properties[property]);

    while (it.at() && !stopVertex.properties[property] && !it.end()) {
      const next = it.next();

      if (next) {
        clipLine.geometry.coordinates.push(next);
      }
    }

    clipLine.geometry.coordinates.push(stopVertex.geometry.coordinates);

    return clipLine;
  }
}
