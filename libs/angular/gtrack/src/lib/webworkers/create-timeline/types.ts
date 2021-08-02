import {
  TimelineDeps,
  TimelineItem,
} from '@bit/garlictech.universal.gtrack.timeline/lib/types';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike/lib/calculated-hike';

export type CreateTimelineInput = {
  deps: TimelineDeps;
  hike: CalculatedHike;
};

export type CreateTimelineOutput = Array<Omit<TimelineItem, 'stopDetails'>>;
