export enum ActivityType {
  HIKING,
}

export interface CurrentActivity {
  ongoingActivityId: string;
  activityType: ActivityType;
}
