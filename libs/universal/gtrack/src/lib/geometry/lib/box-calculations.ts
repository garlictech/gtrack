import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import {
  BoundingBox,
  Point,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import {
  circle,
  distance,
  envelope,
  featureCollection as turfFeatureCollection,
  lineString as turfLineString,
  FeatureCollection,
  Feature,
  LineString,
  Position,
  midpoint,
  AllGeoJSON,
  featureCollection,
} from '@turf/turf';
import { geoBounds as d3GeoBounds } from 'd3-geo';
import * as rewind from 'geojson-rewind';
import * as fp from 'lodash/fp';
import { Circle } from '../interfaces';
import {
  convertGeojsonPointFeatureToPoint,
  convertGeojsonPositionToTurfPoint,
  convertPointToTurfPoint,
} from './point-transformations';
import { Option, chain, some, isSome } from 'fp-ts/lib/Option';

export const getPaddedBoundingBoxOfFeature = (
  features: AllGeoJSON,
  padding = 0
): BoundingBox => {
  const d3Bounds = d3GeoBounds(rewind(features, true));

  return {
    SouthWest: {
      lat: d3Bounds[0][1] + padding,
      lon: d3Bounds[0][0] + padding,
    },
    NorthEast: {
      lat: d3Bounds[1][1] - padding,
      lon: d3Bounds[1][0] - padding,
    },
  };
};

// about 330m padding
export const getPaddedBoxOfTrack = (track: Feature<LineString>): BoundingBox =>
  getPaddedBoundingBoxOfFeature(track, 0.003);

export const getBoundingBoxOfTrack = (features: AllGeoJSON): BoundingBox =>
  getPaddedBoundingBoxOfFeature(features);

export const getCenterRadiusOfBox = (bounds: BoundingBox): Option<Circle> => {
  const p1 = convertPointToTurfPoint(bounds.SouthWest);
  const p2 = convertPointToTurfPoint(bounds.NorthEast);

  return pipe(
    midpoint(p1, p2),
    convertGeojsonPointFeatureToPoint,
    chain((center: Point) =>
      some({
        radius: distance(p1, p2, { units: 'kilometers' }) * 500,
        center,
      })
    )
  );
};

const fetchEnvelopeCoordinates = (
  featureCollection: FeatureCollection
): [Position, Position] | null => {
  const env = envelope(featureCollection);

  if (env.geometry) {
    const coordinates = env.geometry.coordinates[0];

    return [
      [coordinates[0][1], coordinates[0][0]],
      [coordinates[2][1], coordinates[2][0]],
    ];
  } else {
    return null;
  }
};

export const envelopeOfPoints = (
  points: Position[]
): [Position, Position] | null => {
  const features = points.map(point =>
    convertGeojsonPositionToTurfPoint(point)
  );
  const featureCollection = turfFeatureCollection(features);
  return fetchEnvelopeCoordinates(featureCollection);
};

export const envelopeOfPaths = (
  paths: LineString[]
): O.Option<[Position, Position]> => {
  return pipe(
    paths,
    fp.map(path => path.coordinates),
    fp.map(x => turfLineString(x)),
    turfFeatureCollection,
    fetchEnvelopeCoordinates,
    O.fromNullable
  );
};

export const boundingBoxOfPaths = (paths: LineString[]): BoundingBox => {
  return fp.flow(envelopeOfPaths, (bounds: [Position, Position]) => ({
    SouthWest: { lat: bounds[0][0], lon: bounds[0][1] },
    NorthEast: { lat: bounds[1][0], lon: bounds[1][1] },
  }))(paths);
};

export const envelopeOfCircle = (
  center: Position,
  radius: number
): [Position, Position] | null => {
  const centerPoint = convertGeojsonPositionToTurfPoint(center);
  const crcl = circle(centerPoint, Math.ceil(radius / 1000));
  return pipe([crcl], featureCollection, fetchEnvelopeCoordinates);
};

export const splitBoundingBox = (
  bounds: BoundingBox,
  maxRadius: number,
  boundsArr: BoundingBox[]
): void => {
  const center = getCenterRadiusOfBox(bounds);

  if (isSome(center)) {
    if (center.value.radius < maxRadius) {
      boundsArr.push(bounds);
    } else {
      const geo = center.value;
      // Chech quarter rectangles
      splitBoundingBox(
        {
          SouthWest: { lat: bounds.SouthWest.lat, lon: bounds.SouthWest.lon },
          NorthEast: geo.center,
        },
        maxRadius,
        boundsArr
      );
      splitBoundingBox(
        {
          SouthWest: { lat: geo.center.lat, lon: bounds.SouthWest.lon },
          NorthEast: { lat: bounds.NorthEast.lat, lon: geo.center.lon },
        },
        maxRadius,
        boundsArr
      );
      splitBoundingBox(
        {
          SouthWest: { lat: bounds.SouthWest.lat, lon: geo.center.lon },
          NorthEast: { lat: geo.center.lat, lon: bounds.NorthEast.lon },
        },
        maxRadius,
        boundsArr
      );
      splitBoundingBox(
        {
          SouthWest: geo.center,
          NorthEast: { lat: bounds.NorthEast.lat, lon: bounds.NorthEast.lon },
        },
        maxRadius,
        boundsArr
      );
    }
  }
};
