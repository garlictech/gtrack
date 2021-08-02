import * as fp from 'lodash/fp';
import API from '@aws-amplify/api';
import { Auth } from 'aws-amplify';
import AWSAppSyncClient, {
  AUTH_TYPE,
  AWSAppSyncClientOptions,
} from 'aws-appsync/lib';
import { from, Observable } from 'rxjs';
import { AmplifyApiConfig } from '../types';
import { DocumentNode } from 'graphql';
import { buildRetryLogic } from '@bit/garlictech.universal.gtrack.fp';
import { ApolloQueryResult } from 'apollo-client';
import { map } from 'rxjs/operators';

export interface Logger {
  warn: (arg0: string) => void;
  error: (arg0: string) => void;
  debug: (arg0: string) => void;
}

export class GraphqlApiClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _client: AWSAppSyncClient<any>;
  private _graphqlRetryLogic: ReturnType<typeof buildRetryLogic>;

  constructor(
    genericConfig: AmplifyApiConfig,
    specificConfig: Partial<AWSAppSyncClientOptions>,
    private logger: Logger
  ) {
    API.configure(genericConfig);

    const parser = fp.memoize((error: unknown) =>
      JSON.parse(fp.get('graphQLErrors[0].message', error))
    );

    const retryable = (error: unknown) => {
      try {
        return fp.flow(
          err => parser(err).retryable,
          retryable => (fp.isBoolean(retryable) ? retryable : true)
        )(error);
      } catch (_err) {
        return true;
      }
    };

    const retryDelayInMillisec = (error: unknown) => {
      try {
        return fp.flow(
          err => parser(err).retryDelay,
          retryable => (fp.isNumber(retryable) ? retryable * 1000 : 2000)
        )(error);
      } catch (_err) {
        return 2000;
      }
    };

    this._graphqlRetryLogic = buildRetryLogic({
      logger: this.logger,
      retryable,
      retryDelayInMillisec,
    });

    this._client = new AWSAppSyncClient({
      url: genericConfig.aws_appsync_graphqlEndpoint,
      region: genericConfig.aws_appsync_region,
      ...specificConfig,
    } as AWSAppSyncClientOptions);
  }

  query<T = unknown>(
    document: DocumentNode,
    variables?: Record<string, unknown>
  ): Observable<ApolloQueryResult<T>> {
    this.logger.debug(
      `Query ${JSON.stringify(document)} called with variables ${JSON.stringify(
        variables,
        null,
        2
      )}`
    );
    return from(
      this._client.query({
        query: document,
        variables,
      })
    ).pipe(
      this._graphqlRetryLogic,
      map(x => x as ApolloQueryResult<T>)
    );
  }

  mutate(
    document: DocumentNode,
    variables?: Record<string, unknown>
  ): Observable<unknown> {
    return from(
      this._client.mutate({
        mutation: document,
        variables,
      })
    ).pipe(this._graphqlRetryLogic);
  }
}

export class GraphqlApiFp {
  static createAuthenticatedClient(
    config: AmplifyApiConfig,
    logger: Logger,
    disableOffline: boolean
  ): GraphqlApiClient {
    return new GraphqlApiClient(
      config,
      {
        auth: {
          type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
          jwtToken: async () =>
            (await Auth.currentSession()).getIdToken().getJwtToken(),
        },
        complexObjectsCredentials: () => Auth.currentCredentials(),
        offlineConfig: {
          keyPrefix: 'authenticated',
        },
        disableOffline,
      },
      logger
    );
  }

  static createPublicClient(
    config: AmplifyApiConfig,
    logger: Logger,
    disableOffline: boolean
  ): GraphqlApiClient {
    return new GraphqlApiClient(
      config,
      {
        auth: {
          type: AUTH_TYPE.API_KEY,
          apiKey: config.api_key,
        },
        offlineConfig: {
          keyPrefix: 'public',
        },
        disableOffline,
      },
      logger
    );
  }

  static createAdminClient(
    config: AmplifyApiConfig,
    logger: Logger,
    disableOffline: boolean
  ): GraphqlApiClient {
    return new GraphqlApiClient(
      config,
      {
        auth: {
          type: AUTH_TYPE.AWS_IAM,
          credentials: () => Auth.currentCredentials(),
        },
        offlineConfig: {
          keyPrefix: 'admin',
        },
        disableOffline,
      },
      logger
    );
  }

  static createBackendClient(
    config: AmplifyApiConfig,
    accessKeyId: string,
    secretAccessKey: string,
    logger: Logger
  ): GraphqlApiClient {
    return new GraphqlApiClient(
      config,
      {
        url: config.aws_appsync_graphqlEndpoint,
        region: config.aws_appsync_region,
        auth: {
          type: AUTH_TYPE.AWS_IAM,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        },
        disableOffline: true,
      },
      logger
    );
  }
}
