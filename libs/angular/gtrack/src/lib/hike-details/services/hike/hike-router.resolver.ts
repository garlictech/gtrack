import { Injectable } from '@angular/core';
import { DataRouterResolver } from '@bit/garlictech.angular.gtrack.gtrack-data';
import { CreateHikeInput } from '@bit/garlictech.universal.gtrack.graphql-api';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { HikeService } from './hike.service';

@Injectable({ providedIn: 'root' })
export class HikeRouterResolver extends DataRouterResolver<
  CreateHikeInput,
  CalculatedHike,
  HikeService
> {
  constructor(service: HikeService) {
    super(service);
  }
}
