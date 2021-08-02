import {
  CreateImage,
  GetImage,
  CreateImageInput,
  Image,
  UpdateImage,
  DeleteImage,
  GetMultipleImages,
  CreateMultipleImages,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import {
  GraphqlCRUDApi,
  getCRUDApi,
} from '@bit/garlictech.universal.gtrack.graphql-data';
import { GraphqlApiClient } from '@bit/garlictech.universal.gtrack.graphql-api';

export const createImageApi = (
  adminClient: GraphqlApiClient,
  publicClient: GraphqlApiClient
): GraphqlCRUDApi<CreateImageInput, Image> =>
  getCRUDApi({
    add: {
      graphqlClient: adminClient,
      dataPath: 'data.createImage',
      graphqlDocument: CreateImage,
    },
    getById: {
      graphqlClient: publicClient,
      dataPath: 'data.getImage',
      graphqlDocument: GetImage,
    },
    update: {
      graphqlClient: adminClient,
      dataPath: 'data.updateImage',
      graphqlDocument: UpdateImage,
    },
    delete: {
      graphqlClient: adminClient,
      dataPath: 'data.deleteImage.id',
      graphqlDocument: DeleteImage,
    },
    getWithQuery: {
      get: {
        graphqlClient: publicClient,
        dataPath: 'data.getMultipleImages.data',
        graphqlDocument: GetMultipleImages,
      },
      create: {
        graphqlClient: adminClient,
        dataPath: 'data.createMultipleImages',
        graphqlDocument: CreateMultipleImages,
      },
      unprocessedPath: 'data.getMultipleImages.unprocessedKeys',
    },
  });
