// to eliminate "Error: fetch is not found globally and no fetcher passed, to fix pass a fetch for your environment like https://www.npmjs.com/package/node-fetch." problem
// See: https://github.com/lquixada/cross-fetch
import 'cross-fetch/polyfill';
import { Injectable } from '@nestjs/common';

import {
  GraphqlApiClient,
  GraphqlApiFp,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { Logger } from '@bit/garlictech.nodejs.shared.bunyan-logger';
import { AmplifyConfigService } from './amplify-config.service';

@Injectable()
export class GraphqlClientService {
  public readonly publicClient: GraphqlApiClient;
  public readonly adminClient: GraphqlApiClient;
  public readonly authenticatedClient: GraphqlApiClient;
  public readonly backendClient: GraphqlApiClient;

  constructor(amplifyConfig: AmplifyConfigService) {
    this.publicClient = GraphqlApiFp.createPublicClient(
      amplifyConfig.config,
      Logger,
      true
    );

    this.adminClient = GraphqlApiFp.createAdminClient(
      amplifyConfig.config,
      Logger,
      true
    );

    this.authenticatedClient = GraphqlApiFp.createAuthenticatedClient(
      amplifyConfig.config,
      Logger,
      true
    );

    this.backendClient = GraphqlApiFp.createBackendClient(
      amplifyConfig.config,
      process.env.GRAPHQL_ACCESS_KEY_ID || '',
      process.env.GRAPHQL_SECRET_ACCESS_KEY || '',
      Logger
    );
  }
}
