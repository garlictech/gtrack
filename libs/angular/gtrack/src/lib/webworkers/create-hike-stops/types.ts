import { Poi, Image } from '@bit/garlictech.universal.gtrack.graphql-api';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike/lib/calculated-hike';
import { HikeStop } from '@bit/garlictech.universal.gtrack.hike-stops/lib/hike-stop';
import { ResolvedCheckpoint } from '@bit/garlictech.universal.gtrack.checkpoints/lib/types';

export interface HikeStopWorkerInput {
  items: (Poi | Image)[];
  hike: CalculatedHike;
}

export interface HikeStopWorkerOutput {
  pois: Poi[];
  images: Image[];
  checkpoints: ResolvedCheckpoint[];
  stops: HikeStop[];
}
