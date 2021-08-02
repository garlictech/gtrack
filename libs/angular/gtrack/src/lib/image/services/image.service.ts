import { Injectable, Injector } from '@angular/core';
import { HikingObjectCollectionServiceBase } from '@bit/garlictech.angular.gtrack.gtrack-data';
import {
  CreateImageInput,
  Image,
  PlaceType,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import * as fp from 'lodash/fp';
import { Observable } from 'rxjs';

import { Feature, Polygon } from '@turf/helpers';
import { searchSafeImagesInPolygon } from '@bit/garlictech.universal.gtrack.graphql-data';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ImageService extends HikingObjectCollectionServiceBase<
  CreateImageInput,
  Image
> {
  constructor(injector: Injector) {
    super('Image', injector);
  }

  protected searchPlaceType: PlaceType = PlaceType.image;

  searchSafeImagesInPolygon({
    searchPolygon,
    maxItemNo,
  }: {
    searchPolygon: Feature<Polygon>;
    maxItemNo?: number;
  }): Observable<Image[]> {
    return searchSafeImagesInPolygon({
      maxItemNo,
      searchPolygon,
    })({
      graphqlClient: this.apiService.publicClient,
    }).pipe(this.resolveData);
  }

  allowedImages$ = this.getFilteredImages();

  // bannedImages$ = this.getFilteredImages(true);

  private getFilteredImages(): Observable<Image[]> {
    return this.selectors$.entities$.pipe(
    );
  }
}
