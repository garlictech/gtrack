export const GtrackDefaults = {
  hikeStartTime: (): Date => new Date(),
  averageSpeed: (): number => 4, // km/h
  distanceOfSamePoisInMeters: (): number => 30,
  thumbnailWidthInPixel: (): number => 320,
  cardImageWidthInPixel: (): number => 640,
  smallRouteBufferSize: (): number => 100, // meters
  bigRouteBufferSize: (): number => 1000, // meters
};
