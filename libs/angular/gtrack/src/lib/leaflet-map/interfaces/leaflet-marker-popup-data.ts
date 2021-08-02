export interface LeafletMarkerPopupData {
  popupComponentName: string;
  markerClickCallback: any;
  closeCallback: any;
  map: L.Map;
  width?: number;
  className?: string;
  data: any;
}
