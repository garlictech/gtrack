import { Deps } from '@bit/garlictech.universal.gtrack.google-maps';
import { Client } from '@googlemaps/google-maps-services-js';

export const googleMapsDeps: Deps = {
  apiKey: process.env.GOOGLE_API_KEY || '',
  client: new Client({}),
};
