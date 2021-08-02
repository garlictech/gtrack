import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import * as L from 'leaflet';
import { LeafletMapData } from '../interfaces/leaflet-map-data';
import { LeafletMapFp } from './leaflet-map.fp';

export class LeafletMapHikesFp {
  static addHikeRoute(
    mapData: LeafletMapData,
    hike: CalculatedHike
  ): L.LayerGroup {
    const feature = { ...hike.route.track };

    const styles = [
      { color: 'black', opacity: 0.1, weight: 8 },
      { color: 'white', opacity: 0.8, weight: 6 },
      { color: 'red', opacity: 1, weight: 2 },
    ];

    const featureGroup = LeafletMapFp.createFeatureGroupFromGeoJSONObject(
      feature,
      styles
    );
    LeafletMapFp.addLayer(mapData, featureGroup);

    return featureGroup;
  }
}
