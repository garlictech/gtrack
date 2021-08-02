import { Inject, Injectable } from '@angular/core';
import { APPSYNC_CONFIG_TOKEN } from './interfaces';
import {
  GraphqlApiClient,
  GraphqlApiFp,
  AmplifyApiConfig,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class GraphqlClientService {
  public readonly publicClient: GraphqlApiClient;
  public readonly adminClient: GraphqlApiClient;
  public readonly authenticatedClient: GraphqlApiClient;

  constructor(
    log: NGXLogger,
    @Inject(APPSYNC_CONFIG_TOKEN) config: AmplifyApiConfig
  ) {
    this.publicClient = GraphqlApiFp.createPublicClient(config, log, false);

    this.adminClient = GraphqlApiFp.createAdminClient(config, log, true);

    this.authenticatedClient = GraphqlApiFp.createAuthenticatedClient(
      config,
      log,
      true
    );
  }
}
