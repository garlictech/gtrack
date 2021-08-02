// Don't remove the line break :) the import above must be the first.
import * as L from 'leaflet';

import { LeafletTileLayerDef } from './leaflet-tile-layer-def';

export interface LeafletMapData {
  leafletMap: L.Map;
  overlappingMarkerSpiderfier: any;
  baseLayerDef: LeafletTileLayerDef;
  overlayLayerDef: LeafletTileLayerDef;
  geoJSONLayerGroup: L.LayerGroup;
}
