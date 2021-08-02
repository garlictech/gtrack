import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AwsServiceBase } from './aws-service-base';

@Injectable()
export class CognitoService extends AwsServiceBase {
  public cognitoIdProvider;

  constructor() {
    super();
    this.cognitoIdProvider = new AWS.CognitoIdentityServiceProvider();
  }
}
