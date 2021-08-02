import { Injectable } from '@angular/core';

import { Image, Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { ImageService } from '@bit/garlictech.angular.gtrack.image';
import { PoiService } from '@bit/garlictech.angular.gtrack.poi';

import { Observable, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Feature, Polygon } from '@turf/helpers';

@Injectable({ providedIn: 'root' })
export class ObjectsInBufferResolverService {
  constructor(
    private readonly poiService: PoiService,
    private readonly imageService: ImageService
  ) {}

  public resolve(
    searchPolygon: Feature<Polygon>,
    maxImageNo?: number
  ): Observable<(Poi | Image)[]> {
    return forkJoin([
      this.poiService.searchInPolygon({ searchPolygon }),
      this.resolveSafeImages(searchPolygon, maxImageNo),
    ]).pipe(
      take(1),
      map(([x, y]: [(Poi | Image)[], (Poi | Image)[]]) => x.concat(y))
    );
  }

  public resolveAllImages(
    searchPolygon: Feature<Polygon>,
    maxImageNo?: number
  ): Observable<Image[]> {
    return this.imageService.searchInPolygon({
      searchPolygon,
      maxItemNo: maxImageNo,
    });
  }

  public resolveSafeImages(
    searchPolygon: Feature<Polygon>,
    maxImageNo?: number
  ): Observable<Image[]> {
    return this.imageService.searchSafeImagesInPolygon({
      searchPolygon,
      maxItemNo: maxImageNo,
    });
  }
}
