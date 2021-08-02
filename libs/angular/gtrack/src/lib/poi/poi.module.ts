import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EntityDataService } from '@ngrx/data';
import { PoiImagesWithinCirclePipe } from './pipes';
import { PoiDataService } from './services';

const PIPES = [PoiImagesWithinCirclePipe];

@NgModule({
  imports: [HttpClientModule],
  declarations: [...PIPES],
  exports: [...PIPES],
})
export class PoiModule {
  constructor(
    entityDataService: EntityDataService,
    poiDataService: PoiDataService
  ) {
    entityDataService.registerService('Poi', poiDataService);
  }
}
