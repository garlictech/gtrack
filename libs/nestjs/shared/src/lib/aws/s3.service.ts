import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AwsServiceBase } from './aws-service-base';

@Injectable()
export class S3Service extends AwsServiceBase {
  public s3;

  constructor() {
    super();
    this.s3 = new AWS.S3({
      signatureVersion: 'v4',
      region: process.env.AWS_REGION,
      params: {
        Bucket: process.env.UPLOAD_BUCKET,
      },
    });
  }
}
