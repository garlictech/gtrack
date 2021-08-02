import * as lambda from '@aws-cdk/aws-lambda';

export const commonLambdaProps = {
  runtime: lambda.Runtime.NODEJS_12_X
};
