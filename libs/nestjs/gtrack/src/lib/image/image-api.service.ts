import { Injectable } from '@nestjs/common';
import { GraphqlCRUDApi } from '@bit/garlictech.universal.gtrack.graphql-data';
import {
  Image,
  CreateImageInput
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { createImageApi } from '@bit/garlictech.universal.gtrack.image';
import { GraphqlClientService } from '@gtrack/nestjs/shared';

@Injectable()
export class ImageApiService {
  public readonly api: GraphqlCRUDApi<CreateImageInput, Image>;

  constructor(graphqlClient: GraphqlClientService) {
    this.api = createImageApi(
      graphqlClient.backendClient,
      graphqlClient.publicClient
    );
  }
}
