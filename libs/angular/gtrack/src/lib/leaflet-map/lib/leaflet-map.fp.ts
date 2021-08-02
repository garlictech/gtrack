import * as fp from 'lodash/fp';
import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';
import {
  Circle,
  envelopeOfCircle,
  envelopeOfPaths,
} from '@bit/garlictech.universal.gtrack.geometry';
import { BoundingBox } from '@bit/garlictech.universal.gtrack.graphql-api';
import { LineString, Position } from '@turf/helpers';
import { GeoJsonObject } from 'geojson';
import { isUndefined } from 'lodash';
import { LeafletMapData } from '../interfaces/leaflet-map-data';
import { Map, LatLngBounds, LatLng, FeatureGroup } from 'leaflet';
import { GeoLocationService } from '../../current-geolocation';
import { filter, tap, catchError, takeUntil } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import * as L from 'leaflet';

const fitBounds = (
  mapData: LeafletMapData,
  box: L.LatLngBoundsExpression,
  maxZoom?: number
): void => {
  mapData.leafletMap.invalidateSize();

  const options: L.FitBoundsOptions = {
    padding: [50, 50],
  };

  if (maxZoom) {
    options.maxZoom = maxZoom;
  }

  mapData.leafletMap.fitBounds(box, options);
};

export class LeafletMapFp {
  static fitBoundingBox(
    mapData: LeafletMapData,
    boundingBox: BoundingBox
  ): void {
    fitBounds(mapData, LeafletMapFp.getBounds(boundingBox));
  }

  static getBounds(boundingBox: BoundingBox): LatLngBounds {
    return new LatLngBounds(
      [boundingBox.SouthWest.lat, boundingBox.SouthWest.lon],
      [boundingBox.NorthEast.lat, boundingBox.NorthEast.lon]
    );
  }

  static getBoundsFromLatLng(bounds: LatLngBounds): BoundingBox {
    return {
      SouthWest: {
        lat: bounds.getSouthWest().lat,
        lon: bounds.getSouthWest().lng,
      },
      NorthEast: {
        lat: bounds.getNorthEast().lat,
        lon: bounds.getNorthEast().lng,
      },
    };
  }

  static fitToCircle(mapData: LeafletMapData, circle: Circle): void {
    const envelope = envelopeOfCircle(
      [circle.center.lon, circle.center.lat],
      circle.radius
    );
    const southWest = new LatLng(envelope![0][0], envelope![0][1]);
    const northEast = new LatLng(envelope![1][0], envelope![1][1]);
    const box = new LatLngBounds(southWest, northEast);
    fitBounds(mapData, box);
  }

  static fitToLines(mapData: LeafletMapData, lineStrings: LineString[]): void {
    const envelope = envelopeOfPaths(lineStrings);
    const southWest = new LatLng(envelope[0][0], envelope[0][1]);
    const northEast = new LatLng(envelope[1][0], envelope[1][1]);
    const box = new LatLngBounds(southWest, northEast);
    fitBounds(mapData, box, 11);
  }

  static addCircle(
    mapData: LeafletMapData,
    circle: Circle,
    color: string
  ): L.Circle {
    const circleLayer = new L.Circle(
      {
        lat: circle.center.lat,
        lng: circle.center.lon,
      },
      circle.radius,
      {
        fill: false,
        color,
      }
    );

    circleLayer.addTo(mapData.leafletMap);
    return circleLayer;
  }

  static createCircleLayer(circle: Circle, color: string): L.FeatureGroup {
    const circleLayer = new L.Circle(
      {
        lat: circle.center.lat,
        lng: circle.center.lon,
      },
      circle.radius,
      {
        fill: false,
        color,
      }
    );
    const featureGroup = new FeatureGroup();
    featureGroup.addLayer(circleLayer);

    return featureGroup;
  }

  static addGeoJSONObject(
    mapData: LeafletMapData,
    geoJson: GeoJsonObject,
    geoJsonStyle?: L.PathOptions
  ): L.GeoJSON {
    const geoJSON = L.geoJSON(geoJson, {
      style: geoJsonStyle,
      pane: 'lofaszpane',
    });

    mapData.geoJSONLayerGroup.addLayer(geoJSON);

    return LeafletMapFp.addLayer(mapData, geoJSON) as L.GeoJSON;
  }

  static createFeatureGroupFromGeoJSONObject(
    geoJson: GeoJsonObject,
    geoJsonStyles: L.PathOptions[]
  ): L.FeatureGroup {
    const featureGroup = L.featureGroup();

    geoJsonStyles.forEach(geoJsonStyle => {
      const geoJSON = L.geoJSON(geoJson, {
        style: geoJsonStyle,
      });

      featureGroup.addLayer(geoJSON);
    });

    return featureGroup;
  }

  static addLayer(mapData: LeafletMapData, layer: L.Layer): L.Layer {
    if (!mapData.leafletMap.hasLayer(layer)) {
      mapData.leafletMap.addLayer(layer);
    }

    return layer;
  }

  static removeLayer(mapData: LeafletMapData, layer?: L.Layer): void {
    if (!isUndefined(layer) && mapData.leafletMap.hasLayer(layer)) {
      mapData.leafletMap.removeLayer(layer);
    } else if (mapData.geoJSONLayerGroup.hasLayer(layer as L.Layer)) {
      mapData.geoJSONLayerGroup.removeLayer(layer as L.Layer);
    }
  }

  static replaceLayer(
    mapData: LeafletMapData,
    oldLayer: L.Layer,
    newLayer: L.Layer
  ): void {
    LeafletMapFp.removeLayer(mapData, oldLayer);
    LeafletMapFp.addLayer(mapData, newLayer);
  }

  static setPaneZIndex(map: Map, paneId: string, zIndex: number): void {
    map.getPane(paneId)!.style.zIndex = zIndex.toString();
  }

  static convertLeafletLatLngToPoint(leafletPoint: L.LatLng): Point {
    return { lat: leafletPoint.lat, lon: leafletPoint.lng };
  }

  static convertGeojsonPositionToLeafletLatlng(position: Position): L.LatLng {
    return new L.LatLng(position[1], position[0], position[2]);
  }
}

export const convertPointToLeafletLatLng = (point: Point): L.LatLng => {
  return new L.LatLng(
    point.lat,
    point.lon,
    point.elevation as number | undefined
  );
};

// This is a dangerous method, we dig into the leaflet code and replace some functions.
// The function mutates its parameter!
export const decorateMap = (geolocationService: GeoLocationService) => (
  map: Map
): void => {
  const that = map as any;
  const stopWatch = new Subject<boolean>();

  const geoSubscription = geolocationService.getLocation().pipe(
    filter(fp.isObject),
    tap(location => that._handleGeolocationResponse(location)),
    takeUntil(stopWatch),
    tap(() => !that._locateOptions.watch && stopWatch.next(true)),
    catchError(err => {
      that._handleGeolocationError(err);
      return throwError(err);
    })
  );

  map.locate = (options: Record<string, unknown>) => {
    that._locateOptions = {
      timeout: 10000,
      watch: false,
      ...options,
    };

    stopWatch.next(true);
    geoSubscription.subscribe();
    return that;
  };

  map.stopLocate = () => {
    if (that._locateOptions) {
      that._locateOptions.setView = false;
    }

    stopWatch.next(true);
    return that;
  };
};
