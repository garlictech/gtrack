import { Injectable } from '@angular/core';
import { GraphqlClientService } from '@bit/garlictech.angular.gtrack.graphql-api';
import { GraphqlApiServiceBase } from '@bit/garlictech.angular.gtrack.gtrack-data';
import {
  CreateImageInput,
  Image,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { createImageApi } from '@bit/garlictech.universal.gtrack.image';

@Injectable({
  providedIn: 'root',
})
export class ImageDataService extends GraphqlApiServiceBase<
  CreateImageInput,
  Image
> {
  constructor(graphqlClient: GraphqlClientService) {
    super(
      createImageApi(graphqlClient.adminClient, graphqlClient.publicClient)
    );
  }

  name: 'ImageDataService';
}
