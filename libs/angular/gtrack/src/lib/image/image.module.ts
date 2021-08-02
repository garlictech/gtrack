import { NgModule } from '@angular/core';
import { EntityDataService } from '@ngrx/data';
import { ImageDataService } from './services';

@NgModule({})
export class ImageModule {
  constructor(
    entityDataService: EntityDataService,
    imageDataService: ImageDataService
  ) {
    entityDataService.registerService('Image', imageDataService);
  }
}
