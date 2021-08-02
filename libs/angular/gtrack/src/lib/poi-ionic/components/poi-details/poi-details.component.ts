import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Image, Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { ImageService } from '@bit/garlictech.angular.gtrack.image';
import { LeafletMapComponentModule } from '@bit/garlictech.angular.gtrack.leaflet-map';
import { PoiIconRowComponentModule } from '@bit/garlictech.angular.gtrack.poi-icons';
import { PoiService } from '@bit/garlictech.angular.gtrack.poi';
import { PoiFp } from '@bit/garlictech.universal.gtrack.poi';
import { Go } from '@bit/garlictech.angular.gtrack.router/store';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils';
import { GalleryComponentModule } from '@bit/garlictech.angular.gtrack.images-ionic';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import * as fp from 'lodash/fp';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { PoiMapComponent } from '../poi-map/poi-map.component';
import { GtrackLeafletControlComponentModule } from '@bit/garlictech.angular.gtrack.gtrack-map';

@Component({
  selector: 'gtrack-poi-details',
  templateUrl: './poi-details.component.html',
  styleUrls: ['./poi-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiDetailsPageComponent implements OnInit {
  @Input() poi$: Observable<Poi>;

  typeList$: Observable<string>;
  infoUrls$: Observable<{ urlType: string; url: string }[]>;
  imageUrls$: Observable<string[]>;

  constructor(
    private readonly _store: Store,
    private readonly poiService: PoiService,
    private readonly imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.typeList$ = this.poi$.pipe(
      map(poi => this.poiService.getPoiTypeList(poi))
    );
    this.infoUrls$ = this.poi$.pipe(map(PoiFp.collectUrls));

    this.imageUrls$ = this.poi$.pipe(
      filter(fp.isObject),
      switchMap((poi: Poi) =>
        this.imageService.searchInCircle({
          circle: { radius: 100, center: { lat: poi.lat, lon: poi.lon } },
        })
      ),
      map(
        fp.flow(
          fp.remove(fp.property('banned')),
          fp.map((image: Image) => image.thumbnail.url),
          fp.shuffle
        )
      )
    );
  }

  showPoiComments(poi: Poi): void {
    if (poi) {
      this._store.dispatch(
        new Go(['messages', 'POI', poi.id], {
          queryParams: {
            data: JSON.stringify({
              description: poi.description,
            }),
          },
        })
      );
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UtilsModule,
    GalleryComponentModule,
    LeafletMapComponentModule,
    TranslateModule,
    IonicModule,
    PoiIconRowComponentModule,
    GtrackLeafletControlComponentModule,
  ],
  declarations: [PoiDetailsPageComponent, PoiMapComponent],
  exports: [PoiDetailsPageComponent],
})
export class PoiDetailsComponentModule { }
