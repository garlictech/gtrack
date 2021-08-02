import {
  PoiSourceObject,
  TextualDescription,
  CreateImageInput,
} from '@bit/garlictech.universal.gtrack.graphql-api';

export type PoiSearchOutputType = (ExternalPoi | CreateImageInput)[];

interface ExternalPoiType {
  lat: number;
  lon: number;
  elevation: -1;
  id: '';
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

export interface GoogleApiConfig {
  apiKey: string;
}
