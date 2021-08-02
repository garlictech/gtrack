import { DoWork, ObservableWorker } from 'observable-webworker';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { TimelineFp } from '@bit/garlictech.universal.gtrack.timeline/lib/timeline.fp';
import { CreateTimelineInput, CreateTimelineOutput } from './types';

@ObservableWorker()
export class CreateTimelineWorker
  implements DoWork<CreateTimelineInput, CreateTimelineOutput> {
  work(input$: Observable<CreateTimelineInput>): Observable<any> {
    return input$.pipe(
      map(input => TimelineFp.createTimeline(input.deps)(input.hike))
    );
  }
}
