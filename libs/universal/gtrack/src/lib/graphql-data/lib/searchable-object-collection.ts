import { resolveByMultipleKeys, QueryExecutor } from './object-collection';
import * as E from 'fp-ts/lib/Either';
import {
  Circle,
  removePointsOutsideOfPolygon,
  getCenterRadiusOfBox,
  getPaddedBoundingBoxOfFeature
} from '@bit/garlictech.universal.gtrack.geometry';
import {
  Place,
  PlaceType,
  SearchPlaceByTitle,
  SearchPlaceInCircle,
  SearchPlaceByObjectId,
  SearchSafeImageInCircle
} from '@bit/garlictech.universal.gtrack.graphql-api';
import * as fp from 'lodash/fp';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import {
  delay,
  expand,
  map,
  reduce,
  takeLast,
  tap,
  take,
  switchMap
} from 'rxjs/operators';
import { DocumentNode } from 'graphql';
import { createPagedArrayLimitIndicator } from '@bit/garlictech.universal.gtrack.fp';
import { GraphqlApiClient } from '@bit/garlictech.universal.gtrack.graphql-api';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import { Reader } from 'fp-ts/lib/Reader';
import { Feature, Polygon } from '@turf/helpers';

type PlacePicked = Pick<Place, 'lat' | 'lon'>;

interface SearchParameterBase {
  resultFilter?: (place: PlacePicked[]) => PlacePicked[];
  maxItemNo?: number;
  from?: number;
  placeType: PlaceType;
}

export interface SearchInCircleParameters extends SearchParameterBase {
  circle: Circle;
}

export interface SearchByTitleParameters extends SearchParameterBase {
  searchTerm: string;
}

export const getMaxPageItemNumber = 100;

type SearchDependencies = {
  graphqlClient: GraphqlApiClient;
};

type DependencyReader = Reader<
  SearchDependencies,
  Observable<E.Either<unknown, string[]>>
>;

const executeSearch = (
  searchArgs: Record<string, unknown>,
  maxItemNo: number | undefined,
  from: number,
  resultFilter: ((place: PlacePicked[]) => Partial<Place>[]) | undefined,
  searchOperation: DocumentNode,
  responseDataPath: string
): DependencyReader => deps => {
  const isPositive = (x: number | undefined) =>
    fp.isNumber(x) && fp.isFinite(x) && x > 0;

  const pageSize = isPositive(maxItemNo)
    ? Math.min((maxItemNo as unknown) as number, getMaxPageItemNumber)
    : getMaxPageItemNumber;

  const args = { ...searchArgs, pageSize };

  const limitIndicator = isPositive(maxItemNo)
    ? createPagedArrayLimitIndicator((maxItemNo as unknown) as number)
    : undefined;

  const getPage = (currentFrom = from) =>
    deps.graphqlClient
      .query(searchOperation, { ...args, from: currentFrom })
      .pipe(
        map(response => fp.get(responseDataPath, response) || []),
        tap(items => limitIndicator && limitIndicator.addArray(items)),
        map((items: Place[]) => ({
          items,
          nextFrom: currentFrom + items.length,
          isNext:
            items.length >= pageSize &&
            (limitIndicator ? !limitIndicator.limitReached() : true)
        }))
      );

  const addResults = (objectIds: string[], places: Place[]): string[] =>
    fp.flow(
      fp.uniqBy('objectId'),
      (items: Place[]) =>
        resultFilter ? resultFilter(items) : fp.identity(items),
      fp.map('objectId'),
      fp.concat(objectIds),
      fp.uniq
    )(places);

  return getPage().pipe(
    expand(({ nextFrom, isNext }) =>
      isNext ? getPage(nextFrom).pipe(delay(500)) : EMPTY
    ),
    x => x,
    reduce((acc: string[], { items }) => addResults(acc, items), []),
    takeLast(1),
    map(E.right)
  );
};

export const searchDataInCircle = ({
  circle,
  resultFilter,
  maxItemNo,
  placeType,
  from = 0
}: SearchInCircleParameters): DependencyReader =>
  executeSearch(
    {
      lat: circle.center.lat,
      lon: circle.center.lon,
      radius: circle.radius,
      type: placeType,
      from
    },
    maxItemNo,
    from,
    resultFilter,
    SearchPlaceInCircle,
    'data.searchPlaceInCircle'
  );

export const searchByTitle = ({
  searchTerm,
  resultFilter,
  maxItemNo,
  placeType,
  from = 0
}: SearchByTitleParameters): DependencyReader =>
  executeSearch(
    {
      title: searchTerm,
      type: placeType,
      from
    },
    maxItemNo,
    from,
    resultFilter,
    SearchPlaceByTitle,
    'data.searchPlaceByTitle'
  );

export const searchSafeImagesInCircle = ({
  circle,
  resultFilter,
  maxItemNo,
  placeType,
  from = 0
}: SearchInCircleParameters): DependencyReader =>
  executeSearch(
    {
      lat: circle.center.lat,
      lon: circle.center.lon,
      radius: circle.radius,
      type: placeType,
      from
    },
    maxItemNo,
    from,
    resultFilter,
    SearchSafeImageInCircle,
    'data.searchSafeImageInCircle'
  );

export const searchByObjectId = (objectId: string) => (
  apiService: GraphqlApiClient
): Observable<E.Either<unknown, string[]>> =>
  apiService
    .query(SearchPlaceByObjectId, { objectId })
    .pipe(map(fp.get('data.searchPlaceByObjectId')));

const searchDataInPolygonTask = ({
  searchPolygon,
  maxItemNo,
  placeType
}: {
  searchPolygon: Feature<Polygon>;
  maxItemNo?: number;
  placeType: PlaceType;
}) => (task: typeof searchDataInCircle): DependencyReader => deps =>
  pipe(
    searchPolygon,
    getPaddedBoundingBoxOfFeature,
    getCenterRadiusOfBox,
    O.map(circle => ({
      circle,
      resultFilter: removePointsOutsideOfPolygon(searchPolygon),
      maxItemNo,
      placeType
    })),
    O.map(searchParameters => pipe(deps, task(searchParameters), take(1))),
    data =>
      O.isSome(data)
        ? data.value
        : of(
            E.left(
              new Error('Cannot determine circle around the search polygon')
            )
          )
  );

export const searchDataInPolygon = ({
  searchPolygon,
  maxItemNo,
  placeType
}: {
  searchPolygon: Feature<Polygon>;
  maxItemNo?: number;
  placeType: PlaceType;
}): DependencyReader =>
  searchDataInPolygonTask({ searchPolygon, maxItemNo, placeType })(
    searchDataInCircle
  );

export const searchSafeImagesInPolygon = ({
  searchPolygon,
  maxItemNo
}: {
  searchPolygon: Feature<Polygon>;
  maxItemNo?: number;
}): DependencyReader =>
  searchDataInPolygonTask({
    searchPolygon,
    maxItemNo,
    placeType: PlaceType.image
  })(searchSafeImagesInCircle);

type ResolveDependencies<FOUND_ITEMS> = {
  graphqlClient: GraphqlApiClient;
  queryExecutor: QueryExecutor<FOUND_ITEMS>;
};

type ResolveDependencyReader<FOUND_ITEMS> = Reader<
  ResolveDependencies<FOUND_ITEMS>,
  Observable<E.Either<unknown, FOUND_ITEMS[]>>
>;

export const resolveDataInPolygon = <ENTITY>({
  searchPolygon,
  maxItemNo,
  placeType
}: {
  searchPolygon: Feature<Polygon>;
  maxItemNo?: number;
  placeType: PlaceType;
}): ResolveDependencyReader<ENTITY> => deps =>
  searchDataInPolygon({
    searchPolygon,
    maxItemNo,
    placeType
  })({
    graphqlClient: deps.graphqlClient
  }).pipe(
    switchMap(E.fold(throwError, x => of(x))),
    switchMap(ids => resolveByMultipleKeys<ENTITY>(ids)(deps.queryExecutor))
  );
