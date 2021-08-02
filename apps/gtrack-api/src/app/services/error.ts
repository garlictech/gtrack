import { AWSError } from 'aws-sdk';
import { assign, pick } from 'lodash';

export class AwsError {
  public exception: string;
  public message!: string;
  public statusCode!: number;
  public time!: Date;

  constructor(awsError: AWSError) {
    assign(this, pick(awsError, ['message', 'statusCode', 'time']));
    this.exception = awsError.code;
  }
}
