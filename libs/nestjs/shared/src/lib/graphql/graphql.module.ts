import { Module } from '@nestjs/common';
import { GraphqlClientService } from './graphql.service';
import { AmplifyConfigService } from './amplify-config.service';

@Module({
  providers: [AmplifyConfigService, GraphqlClientService],
  exports: [GraphqlClientService],
})
export class GraphqlModule {}
