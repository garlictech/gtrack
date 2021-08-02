import * as fp from 'lodash/fp';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GraphqlCRUDApi, QueryData } from './types';
import { DocumentNode } from 'graphql';
import { GraphqlApiClient } from '@bit/garlictech.universal.gtrack.graphql-api';
import { multipleGet, multipleCreate } from './data-service-utils';
import {
  createMultipleItems,
  updateMultipleItems,
  resolveByMultipleKeys,
  Update
} from './object-collection';
import * as E from 'fp-ts/lib/Either';
import { pipe, flow } from 'fp-ts/lib/function';

interface ApiDescriptorItem {
  graphqlClient: GraphqlApiClient;
  dataPath: string;
  graphqlDocument: DocumentNode;
}

export interface ApiDescriptor {
  add: ApiDescriptorItem;
  getById: ApiDescriptorItem;
  update: ApiDescriptorItem;
  delete: ApiDescriptorItem;
  getWithQuery: {
    get: ApiDescriptorItem;
    create: ApiDescriptorItem;
    unprocessedPath: string;
  };
}

const prepareResult = <ENTITY>(dataPath: string) =>
  map(result =>
    pipe(result, fp.get(dataPath), (data: ENTITY) =>
      fp.isObject(data)
        ? E.right<unknown, ENTITY>(data)
        : E.left<unknown, ENTITY>(result)
    )
  );

class CrudApi<CREATE, ENTITY extends { id: string }> {
  constructor(private readonly apiDescriptor: ApiDescriptor) {}

  add = (input: CREATE): Observable<E.Either<unknown, ENTITY>> =>
    pipe(
      this.apiDescriptor.add,
      ({ graphqlClient, dataPath, graphqlDocument }) =>
        flow(
          () => graphqlClient.mutate(graphqlDocument, { input }),
          prepareResult<ENTITY>(dataPath)
        )()
    );

  getById = (id: string): Observable<E.Either<unknown, ENTITY>> =>
    pipe(
      this.apiDescriptor.getById,
      ({ graphqlClient, dataPath, graphqlDocument }) =>
        flow(
          () => graphqlClient.query(graphqlDocument, { id }),
          prepareResult<ENTITY>(dataPath)
        )()
    );

  update = (
    id: string,
    update: Update<ENTITY>
  ): Observable<E.Either<unknown, ENTITY>> =>
    pipe(
      this.apiDescriptor.update,
      ({ graphqlClient, dataPath, graphqlDocument }) =>
        flow(
          () =>
            graphqlClient.mutate(graphqlDocument, { input: { ...update, id } }),
          prepareResult<ENTITY>(dataPath)
        )()
    );

  delete = (id: string): Observable<E.Either<unknown, boolean>> =>
    pipe(
      this.apiDescriptor.delete,
      ({ graphqlClient, dataPath, graphqlDocument }) =>
        flow(
          () => graphqlClient.mutate(graphqlDocument, { id }),
          x => x,
          map(result =>
            fp.get(dataPath, result) === id
              ? E.right<unknown, boolean>(true)
              : E.left<unknown, boolean>(result)
          )
        )()
    );

  getWithQuery = ({
    action,
    stringifiedData
  }: QueryData): Observable<E.Either<unknown, ENTITY[]>> =>
    pipe(
      this.apiDescriptor.getWithQuery,
      ({ get, create, unprocessedPath }) => {
        switch (action) {
          case 'resolveByMultipleKeys':
            return multipleGet<ENTITY>({
              stringifiedData,
              queryFv: (variables: Record<string, unknown>) =>
                get.graphqlClient.query(get.graphqlDocument, variables),
              itemsPath: get.dataPath,
              unprocessedPath
            });
          case 'createMultipleItems':
            return multipleCreate<CREATE, ENTITY>({
              stringifiedData,
              queryFv: (variables: Record<string, unknown>) =>
                create.graphqlClient.mutate(create.graphqlDocument, variables),
              itemsPath: create.dataPath
            });
          default:
            throw new Error('Unknown graphql api operation');
        }
      }
    );

  createMultipleItems = (
    input: CREATE[]
  ): Observable<E.Either<unknown, ENTITY[]>> =>
    createMultipleItems<CREATE, ENTITY>(input)(params =>
      this.getWithQuery(params)
    );

  updateMultipleItems = (
    input: Update<ENTITY>[]
  ): Observable<E.Either<unknown, ENTITY[]>> =>
    updateMultipleItems<ENTITY>(input)(item => this.update(item.id, item));

  getMultipleItemsById = (
    ids: string[]
  ): Observable<E.Either<unknown, ENTITY[]>> =>
    resolveByMultipleKeys<ENTITY>(ids)(params => this.getWithQuery(params));
}

export const getCRUDApi = <CREATE, ENTITY extends { id: string }>(
  apiDescriptor: ApiDescriptor
): GraphqlCRUDApi<CREATE, ENTITY> => new CrudApi<CREATE, ENTITY>(apiDescriptor);
