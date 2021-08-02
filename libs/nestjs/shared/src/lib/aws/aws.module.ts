import { Module } from '@nestjs/common';
import { CognitoService } from './cognito.service';
import { S3Service } from './s3.service';

@Module({
  providers: [CognitoService, S3Service],
  exports: [CognitoService, S3Service],
})
export class AwsModule {}
