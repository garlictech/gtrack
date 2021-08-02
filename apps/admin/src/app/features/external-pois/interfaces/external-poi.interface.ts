import {
  PoiSourceObject,
  TextualDescription,
} from '@bit/garlictech.universal.gtrack.graphql-api';

interface ExternalPoiType {
  lat: number;
  lon: number;
  elevation?: number;
  types?: string[];
  sourceObject: PoiSourceObject[];
  description: TextualDescription[];
  address?: string;
  phoneNumber?: string;
  openingHours?: string;
}

export type ExternalPoi = Readonly<ExternalPoiType>;

export enum OsmPoiTypes {
  natural = 'natural',
  amenity = 'amenity',
  publicTransport = 'public_transport',
  emergency = 'emergency',
  historic = 'historic',
  leisure = 'leisure',
  manMade = 'man_made',
  military = 'military',
  shop = 'shop',
  tourism = 'tourism',
}
