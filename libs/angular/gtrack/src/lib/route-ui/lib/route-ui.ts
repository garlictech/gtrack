import * as O from 'fp-ts/lib/Option';
import { GeojsonPointType } from '@bit/garlictech.universal.gtrack.geometry';
import { Route } from '@bit/garlictech.universal.gtrack.route';
import { lineString as turfLineString } from '@turf/helpers';
import * as d3 from 'd3';
import { select as d3Select } from 'd3-selection';
import * as fp from 'lodash/fp';
import { pipe } from 'fp-ts/lib/function';
import { RouteForUi } from './types';
/* import { ElevationProfileD3 } from '@bit/garlictech.angular.gtrack.elevation-profile';
 */
/* const createElevationIcon = (coordinates: GeojsonPointType[]): string => {
  if (fp.any(position => fp.isUndefined(position[2]), coordinates)) {
    return '';
  }
 */
  const _iconWidth = 50;
  const _iconHeight = 50;
/*   const _elevationData = ElevationProfileD3.getd3ElevationDataInMeters(
    coordinates,
    _iconWidth,
    _iconHeight
  ); */

  /* if (_elevationData) {
    const _div: HTMLDivElement = document.createElement('div');

    d3Select(_div)
      .append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('version', '1.1')
      .attr('viewBox', `0, 0, ${_iconWidth}, ${_iconHeight}`)
      .append('svg:path')
      .attr('d', _elevationData.lineFunc(_elevationData.lineData))
      .attr('stroke', 'orange')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    return `data:image/svg+xml;utf8,${_div.innerHTML}`;
  } else {
    return '';
  }
}; */

const createRouteIcon = (path: GeojsonPointType[]): string => {
  const _iconWidth = 50;
  const _iconHeight = 50;
  const _div: HTMLDivElement = document.createElement('div');
  const features = [turfLineString(path)];

  const myProjection = d3.geoMercator().fitSize([_iconWidth, _iconHeight], {
    type: 'FeatureCollection',
    features,
  });
  const d3Path = d3.geoPath().projection(myProjection);

  const svg = d3Select(_div)
    .append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('version', '1.1')
    .attr('viewBox', `0, 0, ${_iconWidth}, ${_iconHeight}`);
  svg
    .selectAll('path')
    .data(features)
    .enter()
    .append('path')
    .attr('d', d3Path)
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('fill', 'none');

  return `data:image/svg+xml;utf8,${_div.innerHTML}`;
};

export class RouteForUiFp {
  /* static fromRoute(route: Route): O.Option<RouteForUi> {
    return pipe(
      route,
      (x): RouteForUi => ({
        ...x,
        elevationIcon: fp.memoize(createElevationIcon)(
          route.track.geometry!.coordinates
        ),
        routeIcon: fp.memoize(createRouteIcon)(
          route.track.geometry!.coordinates
        ),
      }),
      O.fromNullable,
    );
  } */
} 
