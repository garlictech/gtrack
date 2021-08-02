import { Module } from '@nestjs/common';
import { GraphqlModule } from '@bit/garlictech.nestjs.shared.graphql';
import { PoiApiService } from './poi-api.service';

@Module({
  imports: [GraphqlModule],
  providers: [PoiApiService],
  exports: [PoiApiService],
})
export class PoiModule {}
