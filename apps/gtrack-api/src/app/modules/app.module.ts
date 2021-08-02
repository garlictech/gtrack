import { Module } from '@nestjs/common';
import { GeoipController } from '../controllers/geoip.controller';
import { CognitoService } from '../services/cognito.service';
import { AuthModule } from './auth.module';
import { ProcessRouteSegmentModule } from '@gtrack/gtrack-api/process-route-segment';
import { ProcessRouteSegmentController } from '../controllers/process-route-handler.controller';

@Module({
  imports: [AuthModule, ProcessRouteSegmentModule],
  controllers: [GeoipController, ProcessRouteSegmentController],
  providers: [CognitoService]
})
export class AppModule {}
