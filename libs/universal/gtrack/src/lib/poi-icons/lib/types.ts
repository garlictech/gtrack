export enum EPoiCategories {
  natural = 'natural',
  amenity = 'amenity',
  publicTransport = 'publicTransport',
  emergency = 'emergency',
  historic = 'historic',
  leisure = 'leisure',
  manMade = 'manMade',
  military = 'military',
  shop = 'shop',
  tourism = 'tourism',
}
export enum EIconStyle {
  DEFAULT = 'default',
  HIGHLIGHTED = 'highlighted',
  PIN = 'pin',
  // for checkpoints
  GREEN = 'green',
  GREY = 'grey',
  RED = 'red',
}

export interface IconDescriptor {
  url: string;
  color: string;
}
