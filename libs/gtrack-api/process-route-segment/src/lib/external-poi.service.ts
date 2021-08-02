import { Logger } from '@bit/garlictech.nodejs.shared.bunyan-logger';
import * as fp from 'lodash/fp';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, delay, map, toArray, mergeMap } from 'rxjs/operators';
import { PoiSearchOutputType, ExternalPoi, OsmPoiTypes } from './lib/types';
import { FlickrService } from './flickr.service';
import { GooglePoiService } from './google-poi.service';
import { OsmPoiService } from './osm-poi.service';
import { WikipediaPoiService } from './wikipedia-poi.service';
import { BoundingBox } from '@bit/garlictech.universal.gtrack.graphql-api';
import { Injectable } from '@nestjs/common';

const filterTypes = fp.flow(
  fp.pullAll(['point_of_interest', 'establishment']),
  fp.map(type => (type === 'locality' ? 'city' : type)),
  fp.map(type => (type === 'stop_position' ? 'bus_station' : type)),
  fp.map(type => (type === 'platform' ? 'bus_station' : type)),
  fp.map(type => (type === 'station' ? 'bus_station' : type))
);

const filterTypesFv = fp.map((item: ExternalPoi) =>
  item.types
    ? {
        ...item,
        types: filterTypes(item.types)
      }
    : item
);

@Injectable()
export class ExternalPoiService {
  constructor(
    private readonly wikipediaPoiService: WikipediaPoiService,
    private readonly osmPoiService: OsmPoiService,
    private readonly googlePoiService: GooglePoiService,
    private readonly flickrService: FlickrService
  ) {}

  get(
    bounds: BoundingBox,
    allLanguages: string[],
    alreadyProcessedSourceObjectIds: string[]
  ): Observable<PoiSearchOutputType> {
    return forkJoin([
      this.wikipediaPoiService.getAll(bounds, allLanguages),
      this.osmPois(bounds),
      this.googlePoiService.get(bounds, alreadyProcessedSourceObjectIds),
      this.flickrService.get(bounds)
    ]).pipe(
      map(fp.flow(fp.flattenDeep, filterTypesFv)),
      catchError(err => {
        Logger.error(`Error in external POI fetch: ${err}`);
        return of([]);
      })
    );
  }

  private osmPois(bounds: BoundingBox): Observable<PoiSearchOutputType> {
    return from([
      OsmPoiTypes.publicTransport,
      OsmPoiTypes.amenity,
      OsmPoiTypes.natural,
      OsmPoiTypes.emergency,
      OsmPoiTypes.historic,
      OsmPoiTypes.leisure,
      OsmPoiTypes.manMade,
      OsmPoiTypes.military,
      OsmPoiTypes.shop,
      OsmPoiTypes.tourism
    ]).pipe(
      mergeMap(
        (osmPoiType: OsmPoiTypes) =>
          this.osmPoiService.get(bounds, osmPoiType).pipe(delay(2000)),
        1
      ),
      toArray(),
      map(fp.flatten)
    );
  }
}
