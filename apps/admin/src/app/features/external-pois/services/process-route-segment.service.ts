import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphqlClientService } from '@bit/garlictech.angular.gtrack.graphql-api';
import { RouteSegment } from '@bit/garlictech.universal.gtrack.route-segment';
import { ProcessRouteSegment } from '@bit/garlictech.universal.gtrack.graphql-api';

@Injectable({ providedIn: 'root' })
export class ProcessRouteSegmentService {
  constructor(private readonly graphqlClient: GraphqlClientService) {}

  process(segment: RouteSegment): Observable<unknown> {
    return this.graphqlClient.adminClient.mutate(ProcessRouteSegment, {
      input: segment.coordinates,
    });
  }
}
