import {
  CreateHike,
  GetHike,
  UpdateHike,
  DeleteHike,
  GetMultipleHikes,
  CreateMultipleHikes,
  CreateHikeInput,
  HikeData,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import {
  GraphqlCRUDApi,
  getCRUDApi,
} from '@bit/garlictech.universal.gtrack.graphql-data';
import { GraphqlApiClient } from '@bit/garlictech.universal.gtrack.graphql-api';

export const createHikeApi = (
  adminClient: GraphqlApiClient,
  publicClient: GraphqlApiClient
): GraphqlCRUDApi<CreateHikeInput, HikeData> =>
  getCRUDApi({
    add: {
      graphqlClient: adminClient,
      dataPath: 'data.createHike',
      graphqlDocument: CreateHike,
    },
    getById: {
      graphqlClient: publicClient,
      dataPath: 'data.getHike',
      graphqlDocument: GetHike,
    },
    update: {
      graphqlClient: adminClient,
      dataPath: 'data.updateHike',
      graphqlDocument: UpdateHike,
    },
    delete: {
      graphqlClient: adminClient,
      dataPath: 'data.deleteHike.id',
      graphqlDocument: DeleteHike,
    },
    getWithQuery: {
      get: {
        graphqlClient: publicClient,
        dataPath: 'data.getMultipleHikes.data',
        graphqlDocument: GetMultipleHikes,
      },
      create: {
        graphqlClient: adminClient,
        dataPath: 'data.createMultipleHikes',
        graphqlDocument: CreateMultipleHikes,
      },
      unprocessedPath: 'data.getMultipleHikes.unprocessedKeys',
    },
  });
