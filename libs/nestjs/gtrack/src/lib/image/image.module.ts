import { Module } from '@nestjs/common';
import { GraphqlModule } from '@bit/garlictech.nestjs.shared.graphql';
import { ImageApiService } from './image-api.service';

@Module({
  imports: [GraphqlModule],
  providers: [ImageApiService],
  exports: [ImageApiService],
})
export class ImageModule {}
