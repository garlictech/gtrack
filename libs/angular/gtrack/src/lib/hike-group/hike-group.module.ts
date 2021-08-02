import { NgModule } from '@angular/core';
import { EntityDataService } from '@ngrx/data';
import { HikeGroupDataService } from './services';

@NgModule({
  providers: [HikeGroupDataService],
})
export class HikeGroupModule {
  constructor(
    entityDataService: EntityDataService,
    hikeGroupDataService: HikeGroupDataService
  ) {
    entityDataService.registerService('HikeGroup', hikeGroupDataService);
  }
}
