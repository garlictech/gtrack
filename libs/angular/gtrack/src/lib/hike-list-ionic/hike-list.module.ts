import { NgModule } from '@angular/core';

import {
  HikeCardListComponent,
  HikeCardListComponentModule,
} from './hike-card-list/hike-card-list.component';
import { HikeCardComponentModule } from './hike-card/hike-card.component';

@NgModule({
  imports: [HikeCardListComponentModule, HikeCardComponentModule],
  exports: [HikeCardListComponent],
})
export class HikeListModule {}
