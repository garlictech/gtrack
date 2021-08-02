import { EventEmitter } from '@angular/core';
import { LeafletEvent } from 'leaflet';

export interface LeafletEventEmitterMap {
  [eventName: string]: EventEmitter<LeafletEvent | number>;
}
