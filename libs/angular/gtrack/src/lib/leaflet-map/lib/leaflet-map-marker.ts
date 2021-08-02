import { LeafletMarkerPopupData } from '../interfaces';

import * as O from 'fp-ts/lib/Option';
import {
  IconDescriptor,
  PoiIconsFp,
} from '@bit/garlictech.universal.gtrack.poi-icons';

export class LeafletMapMarker {
  protected _highlighted: boolean;
  public icon: O.Option<IconDescriptor>;

  constructor(
    public lat: number,
    public lon: number,
    public title: string,
    public iconTag: string,
    public popupData?: LeafletMarkerPopupData
  ) {
    this._highlighted = false;
    this.icon = PoiIconsFp.getIcon(iconTag);
  }

  toggleHighlight(): void {
    this._highlighted = !this._highlighted;
  }

  addHighlight(): void {
    this._highlighted = true;
  }

  removeHighlight(): void {
    this._highlighted = false;
  }

  isHighlighted(): boolean {
    return this._highlighted;
  }

  get highlighted(): boolean {
    return this._highlighted;
  }
}
