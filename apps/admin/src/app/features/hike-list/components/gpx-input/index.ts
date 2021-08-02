import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as toGeoJSON from '@mapbox/togeojson';
import { cloneDeep as _cloneDeep, get as _get } from 'lodash';

const _loadFile = async (file: Blob): Promise<string | ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const _reader: FileReader = new FileReader();
    _reader.onloadend = () => {
      resolve(_reader.result);
    };
    _reader.onerror = () => {
      reject();
    };
    _reader.readAsText(file);
  });

/**
 * Fix MultiLineString if needed (convert to single LineString)
 */
const _checkAndFixMultiLineString = (route: string): void => {
  const _geometry = _get(route, 'features[0].geometry');
  let _lineString: number[][] = [];

  if (_geometry && _geometry.type === 'MultiLineString') {
    for (const i in _geometry.coordinates) {
      if (_geometry.coordinates[i]) {
        const coords = _geometry.coordinates[i];

        _lineString =
          (i as unknown) === 0
            ? _lineString.concat(coords)
            : _lineString.concat(coords.slice(1));
      }
    }

    _geometry.type = 'LineString';
    _geometry.coordinates = _cloneDeep(_lineString);
  }
};

@Component({
  selector: 'gtrack-gpx-input',
  templateUrl: 'ui.html',
  styles: ['input[type=file] { display: none; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpxInputComponent {
  @ViewChild('gpxInput', { static: true }) gpxInput: ElementRef;

  constructor(private readonly _router: Router) {}

  openGPX(): void {
    this.gpxInput.nativeElement.click();
  }

  gpxInputListener($event: { target: { files: Blob[] } }): void {
    const file = $event.target.files[0];

    if (file) {
      _loadFile(file).then((content: string) => {
        const _doc = new DOMParser().parseFromString(
          content,
          'application/xml'
        );
        const _route = toGeoJSON.gpx(_doc);

        _checkAndFixMultiLineString(_route);

        // this.hikeEditingService.gpxRoute = {
        //   route: _route,
        //   bounds: getBoundingBoxOfTrack(_route)
        // };

        // eslint:disable-next-line:no-floating-promises
        this._router.navigate(['/admin/hike/new']);
      });
    }
  }
}
