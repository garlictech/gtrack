export const score = (distanceInMeters: number, uphill: number): number => {
  return Math.round(((distanceInMeters / 1000) * 1.5 + uphill / 50) * 10);
};
