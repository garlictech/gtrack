import {
  HikeStop,
  Translator,
  HikeStopSetDetails,
} from '@bit/garlictech.universal.gtrack.hike-stops';

export interface TimelineNearby {
  types: string[];
  typeList: string;
  titleList?: string;
}

export interface TimelineItem {
  stop: HikeStop;
  backgroundColor: string;
  link?: string;
  // values at arrival
  arrive: number;
  distance?: number;
  stopDetails: HikeStopSetDetails;
  totalUphill?: number;
  downhill?: number;
  totalScore: number;
  // segment values
  score?: number;
  nextStopDistance?: number;
  uphill?: number;
  time?: number;
  nearbyStopsOfNextSegment?: TimelineNearby;
  difficulty: number;
}

export type Timeline = TimelineItem[];

export type TimelineDeps = {
  averageSpeed: number;
  onrouteStops: HikeStop[];
  offrouteStops: HikeStop[];
};

export type TimelineTranslationDeps = {
  translator: Translator;
  currentLanguage: string;
};
