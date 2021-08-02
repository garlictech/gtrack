import { CognitoStack } from './app/cognito-stack';
import { DynamoDBStack } from './app/appsync-dynamodb-stack';
import { SiteStack } from './app/site-stack';
import { AppsyncAppStack } from './app/appsync-app-stack';

export default function main(app: App): void {
  new CognitoStack(app, 'cognito', {});
  const dynamoDbStack = new DynamoDBStack(app, 'dynamodb');
  new SiteStack(app, 'sites');

  const appsyncStack = new AppsyncAppStack(app, 'appsync', {
    poiTable: dynamoDbStack.poiTable,
    hikeTable: dynamoDbStack.hikeTable,
    imageTable: dynamoDbStack.imageTable
  });

  appsyncStack.addDependency(dynamoDbStack);
  // Add more stacks
}
