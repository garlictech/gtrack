import { Injector } from '@angular/core';
import { GraphqlClientService } from '@bit/garlictech.angular.gtrack.graphql-api';
import { PlaceType } from '@bit/garlictech.universal.gtrack.graphql-api';
import {
  SearchByTitleParameters,
  SearchInCircleParameters
} from '@bit/garlictech.universal.gtrack.graphql-data';
import * as E from 'fp-ts/lib/Either';
import { Observable, throwError, of, pipe } from 'rxjs';
import { CollectionServiceBase } from './collection-service-base';
import {
  searchByTitle,
  searchDataInCircle,
  searchDataInPolygon
} from '@bit/garlictech.universal.gtrack.graphql-data';
import { switchMap } from 'rxjs/operators';
import { Feature, Polygon } from '@turf/helpers';

export abstract class HikingObjectCollectionServiceBase<
  CREATE,
  OUTPUT
> extends CollectionServiceBase<CREATE, OUTPUT> {
  protected readonly apiService: GraphqlClientService;

  constructor(collectionName: string, injector: Injector) {
    super(collectionName, injector);
    this.apiService = injector.get(GraphqlClientService);
  }

  protected abstract searchPlaceType: PlaceType;

  protected resolveData = pipe(
    switchMap(E.fold(throwError, x => of(x as string[]))),
    switchMap((objectIds: string[]) => this.resolveByMultipleKeys(objectIds))
  );

  static get getMaxPageItemNumber(): number {
    return 100;
  }

  searchInCircle({
    circle,
    resultFilter,
    maxItemNo,
    from = 0
  }: SearchInCircleParameters): Observable<OUTPUT[]> {
    return searchDataInCircle({
      circle,
      maxItemNo,
      from,
      resultFilter,
      placeType: this.searchPlaceType
    })({
      graphqlClient: this.apiService.publicClient
    }).pipe(this.resolveData);
  }

  searchInPolygon({
    searchPolygon,
    maxItemNo
  }: {
    searchPolygon: Feature<Polygon>;
    maxItemNo?: number;
  }): Observable<OUTPUT[]> {
    return searchDataInPolygon({
      maxItemNo,
      searchPolygon,
      placeType: this.searchPlaceType
    })({
      graphqlClient: this.apiService.publicClient
    }).pipe(this.resolveData);
  }

  searchByTitle({
    searchTerm,
    resultFilter,
    maxItemNo,
    from = 0
  }: SearchByTitleParameters): Observable<OUTPUT[]> {
    return searchByTitle({
      searchTerm,
      resultFilter,
      maxItemNo,
      from,
      placeType: this.searchPlaceType
    })({
      graphqlClient: this.apiService.publicClient
    }).pipe(this.resolveData);
  }
}
