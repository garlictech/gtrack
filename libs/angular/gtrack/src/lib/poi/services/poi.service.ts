import { Injectable, Injector } from '@angular/core';
import { HikingObjectCollectionServiceBase } from '@bit/garlictech.angular.gtrack.gtrack-data';
import {
  CreatePoiInput,
  PlaceType,
  Poi,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { TranslateService } from '@ngx-translate/core';
import * as fp from 'lodash/fp';
import { PoiFp } from '@bit/garlictech.universal.gtrack.poi';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PoiService extends HikingObjectCollectionServiceBase<
CreatePoiInput,
Poi
> {
  constructor(injector: Injector) {
    super('Poi', injector);
    this.translateService = injector.get(TranslateService);
  }

  protected searchPlaceType: PlaceType = PlaceType.poi;
  private translateService: TranslateService;

  getPoiTypeList(poi: Poi): string {
    return poi
      ? fp.flow(
        fp.pullAll(PoiFp.bannedTypes()),
        fp.map((key:string | string[]) => this.translateService.instant(key)),
        fp.join(' | ')
      )(poi.types as string[])
      : '';
  }

  pois$ = this.getPois();

  private getPois(): Observable<Poi[]> {
    return this.selectors$.entities$.pipe(
    );
  }
}