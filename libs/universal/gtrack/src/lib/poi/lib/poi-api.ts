import {
  CreatePoi,
  GetPoi,
  CreatePoiInput,
  Poi,
  UpdatePoi,
  DeletePoi,
  GetMultiplePois,
  CreateMultiplePois,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import {
  GraphqlCRUDApi,
  getCRUDApi,
} from '@bit/garlictech.universal.gtrack.graphql-data';
import { GraphqlApiClient } from '@bit/garlictech.universal.gtrack.graphql-api';

export const createPoiApi = (
  adminClient: GraphqlApiClient,
  publicClient: GraphqlApiClient
): GraphqlCRUDApi<CreatePoiInput, Poi> =>
  getCRUDApi({
    add: {
      graphqlClient: adminClient,
      dataPath: 'data.createPoi',
      graphqlDocument: CreatePoi,
    },
    getById: {
      graphqlClient: publicClient,
      dataPath: 'data.getPoi',
      graphqlDocument: GetPoi,
    },
    update: {
      graphqlClient: adminClient,
      dataPath: 'data.updatePoi',
      graphqlDocument: UpdatePoi,
    },
    delete: {
      graphqlClient: adminClient,
      dataPath: 'data.deletePoi.id',
      graphqlDocument: DeletePoi,
    },
    getWithQuery: {
      get: {
        graphqlClient: publicClient,
        dataPath: 'data.getMultiplePois.data',
        graphqlDocument: GetMultiplePois,
      },
      create: {
        graphqlClient: adminClient,
        dataPath: 'data.createMultiplePois',
        graphqlDocument: CreateMultiplePois,
      },
      unprocessedPath: 'data.getMultiplePois.unprocessedKeys',
    },
  });
