import { Injectable } from '@angular/core';
import { DataRouterResolver } from '@bit/garlictech.angular.gtrack.gtrack-data';
import {
  CreatePoiInput,
  Poi,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { PoiService } from './poi.service';

@Injectable({ providedIn: 'root' })
export class PoiRouterResolver extends DataRouterResolver<
  CreatePoiInput,
  Poi,
  PoiService
> {
  constructor(service: PoiService) {
    super(service);
  }
}
