import { Injectable } from '@angular/core';
import { GraphqlClientService } from '@bit/garlictech.angular.gtrack.graphql-api';
import {
  CreatePoiInput,
  Poi,
} from '@bit/garlictech.universal.gtrack.graphql-api';

import { createPoiApi } from '@bit/garlictech.universal.gtrack.poi';
import { GraphqlApiServiceBase } from '@bit/garlictech.angular.gtrack.gtrack-data';

@Injectable({
  providedIn: 'root',
})
export class PoiDataService extends GraphqlApiServiceBase<CreatePoiInput, Poi> {
  constructor(graphqlClient: GraphqlClientService) {
    super(createPoiApi(graphqlClient.adminClient, graphqlClient.publicClient));
  }

  name: 'PoiDataService';
}
