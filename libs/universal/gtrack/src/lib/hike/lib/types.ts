import { Timeline } from '@bit/garlictech.universal.gtrack.timeline';
import { Image, Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { ResolvedCheckpoint } from '@bit/garlictech.universal.gtrack.checkpoints/lib/types';

export interface ResolvedHikeData {
  hike: CalculatedHike;
  pois: Poi[];
  images: Image[];
  timeline: Timeline;
  checkpoints: ResolvedCheckpoint[];
}
