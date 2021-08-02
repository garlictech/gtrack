import { Injectable } from '@nestjs/common';
import { AmplifyApiConfig } from '@bit/garlictech.universal.gtrack.graphql-api';
import amplifyConfigDev from '@bit/garlictech.universal.gtrack.config/amplify/amplify-config-dev';
import amplifyConfigStaging from '@bit/garlictech.universal.gtrack.config/amplify/amplify-config-staging';
import amplifyConfigMaster from '@bit/garlictech.universal.gtrack.config/amplify/amplify-config-master';

const userPoolClientId = '4i0vmhvjjg0kkgh0ganvu0dc80';
const userPoolId = 'us-east-1_tKwbBvakU';

@Injectable()
export class AmplifyConfigService {
  public readonly config: AmplifyApiConfig;

  constructor() {
    const amplifyConfig =
      process.env.PROJECT_CONFIG === 'master'
        ? amplifyConfigMaster
        : process.env.PROJECT_CONFIG === 'staging'
        ? amplifyConfigStaging
        : amplifyConfigDev;

    this.config = {
      ...amplifyConfig,
      aws_appsync_graphqlEndpoint:
        amplifyConfig.aws_appsync_graphqlEndpoint || '',
      aws_appsync_region: amplifyConfig.aws_appsync_region || '',
      aws_user_pools_id: userPoolId,
      aws_user_pools_web_client_id: userPoolClientId,
      aws_cognito_region: 'us-east-1',
      api_key: 'da2-zmtb33wymrb4lkwr5m5rb43hnu',
    };
  }
}
