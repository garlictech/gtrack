import { TileLayer } from 'leaflet';

export interface LayerDef {
  name: string;
  url: TileLayer;
  options?: any;
}
