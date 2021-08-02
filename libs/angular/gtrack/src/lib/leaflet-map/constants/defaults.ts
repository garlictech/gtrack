import { LeafletMapConfig } from '../interfaces';
import { tileLayer, latLng } from 'leaflet';

export const DEFAULT_LAYERS = [
  tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
];

export const DEFAULT_BASE_LAYERS = {
  street: tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
  topo: tileLayer('https://opentopomap.org/{z}/{x}/{y}.png'),
  satellite: tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  }),
  bike_trails: tileLayer(
    'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=b91d55049c50482da2771ab941a3aeb4'
  ),
};

export const WAYMARKED_TRAILS_PANE_NAME = 'waymarked-trails';

export const DEFAULT_OVERLAYS = {
  trails: tileLayer('http://tile.lonvia.de/hiking/{z}/{x}/{y}.png', {
    pane: WAYMARKED_TRAILS_PANE_NAME,
  }),
  turistautak: tileLayer(
    'https://{s}.tile.openstreetmap.hu/tt/{z}/{x}/{y}.png',
    { pane: WAYMARKED_TRAILS_PANE_NAME }
  ),
};

export const DEFAULT_LEAFLET_MAP_CONFIG: LeafletMapConfig = {
  locationControl: true,
  fullScreenControl: {
    forceSeparateButton: true,
    forcePseudoFullscreen: true,
  },
};

export const DEFAULT_CENTER = latLng(47.4925, 19.0514);
export const DEFAULT_ZOOM = 12;
