import { Controller, Post, Body } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProcessRouteSegmentService } from '@gtrack/gtrack-api/process-route-segment';

@Controller('process-route-segment')
export class ProcessRouteSegmentController {
  constructor(
    private readonly processRouteSegmentService: ProcessRouteSegmentService
  ) {}

  @Post()
  public processRouteSegment(@Body() req: number[][]): Observable<boolean> {
    return this.processRouteSegmentService.process(req);
  }
}
