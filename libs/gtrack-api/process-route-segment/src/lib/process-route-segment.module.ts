import { Module } from '@nestjs/common';
import { HttpClient } from '@bit/garlictech.nestjs.shared.http';
import { WikipediaPoiService } from './wikipedia-poi.service';
import { GooglePoiService } from './google-poi.service';
import { OsmPoiService } from './osm-poi.service';
import { FlickrService } from './flickr.service';
import { ExternalPoiService } from './external-poi.service';
import { PoiModule } from '@bit/garlictech.nestjs.gtrack.poi';
import { ImageModule } from '@bit/garlictech.nestjs.gtrack.image';
import { GraphqlModule } from '@bit/garlictech.nestjs.shared.graphql';
import { ProcessRouteSegmentService } from './process-route-segment.service';

@Module({
  imports: [ImageModule, PoiModule, GraphqlModule],
  providers: [
    HttpClient,
    WikipediaPoiService,
    GooglePoiService,
    OsmPoiService,
    FlickrService,
    ExternalPoiService,
    ProcessRouteSegmentService,
  ],
  exports: [ProcessRouteSegmentService],
})
export class ProcessRouteSegmentModule {}
