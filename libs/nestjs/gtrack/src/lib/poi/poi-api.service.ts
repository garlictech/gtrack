import { Injectable } from '@nestjs/common';
import { GraphqlCRUDApi } from '@bit/garlictech.universal.gtrack.graphql-data';
import {
  Poi,
  CreatePoiInput,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { createPoiApi } from '@bit/garlictech.universal.gtrack.poi';
import { GraphqlClientService } from '@bit/garlictech.nestjs.shared.graphql';

@Injectable()
export class PoiApiService {
  public readonly api: GraphqlCRUDApi<CreatePoiInput, Poi>;

  constructor(graphqlClient: GraphqlClientService) {
    this.api = createPoiApi(
      graphqlClient.backendClient,
      graphqlClient.publicClient
    );
  }
}
