import { AwsModule } from '@bit/garlictech.nestjs.shared.aws';
import { Module } from '@nestjs/common';

@Module({
  imports: [AwsModule],
  providers: [],
})
export class AuthModule {}
