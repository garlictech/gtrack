import * as sst from '@serverless-stack/resources';
import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import { PROJECT_ROOT } from './settings';
import { GraphqlApi, MappingTemplate } from '@aws-cdk/aws-appsync';
import { TableConstruct } from './dynamodb-construct';

export class AppsyncAppStack extends sst.Stack {
  constructor(scope: sst.App, id: string) {
    super(scope, id);
    const app = this.node.root as sst.App;

    // Creates the AppSync API
    const api = new appsync.GraphqlApi(this, 'Api', {
      name: app.logicalPrefixedName('anyupp-appsync-api'),
      schema: appsync.Schema.fromAsset(
        PROJECT_ROOT + 'libs/api/graphql/schema/src/schema/appsync-api.graphql'
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        }
      },
      xrayEnabled: true
    });

    //const apiLambda = new lambda.Function(this, 'AppSyncAnyuppHandler', {
    //  ...commonLambdaProps,
    //  handler: 'lib/api/graphql/appsync-lambda/src/index.handler',
    //  code: lambda.Code.fromAsset(
    //    path.join(__dirname, '../../.serverless/graphql-api.zip')
    //  )
    //});

    //const lambdaDs = api.addLambdaDataSource('lambdaDatasource', apiLambda);

    [
      'AdminUser',
      'Chain',
      'Group',
      'OrderItem',
      'Order',
      'ProductCategory',
      'ChainProduct',
      'Unit',
      'User'
    ].forEach(objectName => this.createCommonResolvers(api, objectName));

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, 'GraphQLAPIKey', {
      value: api.apiKey || ''
    });
  }

  private createCommonResolvers(api: GraphqlApi, label: string): void {
    const theTable = new TableConstruct(this, label, {
      isStreamed: true
    }).theTable;

    const tableDs = api.addDynamoDbDataSource(
      label + 'DynamoDbDataSource',
      theTable
    );

    tableDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'delete' + label,
      requestMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-delete-request-mapping-template.vtl'
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
      )
    });

    tableDs.createResolver({
      typeName: 'Query',
      fieldName: 'get' + label,
      requestMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-get-request-mapping-template.vtl'
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
      )
    });

    tableDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'create' + label,
      requestMappingTemplate: MappingTemplate.fromFile(
        `lib/appsync/graphql-api/mapping-templates/common-create-request-mapping-template.vtl`
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
      )
    });

    //lambdaDs.createResolver({
    //  typeName: 'Mutation',
    //  fieldName: `createMultiple${label}s`,
    //  requestMappingTemplate: MappingTemplate.fromFile(
    //    `lib/appsync/graphql-api/mapping-templates/createMultiple${label}s-request-mapping-template.vtl`
    //  ),
    //  responseMappingTemplate: MappingTemplate.fromFile(
    //    'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
    //  )
    //});

    tableDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'update' + label,
      requestMappingTemplate: MappingTemplate.fromFile(
        `lib/appsync/graphql-api/mapping-templates/common-update-request-mapping-template.vtl`
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
      )
    });
  }
}
