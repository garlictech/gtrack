import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Effects, reducer } from './store';
import { featureName } from './store/state';
import { RoutePlannerStoreModule } from '../route-planner';
import { HikeStopsStoreModule } from '@bit/garlictech.angular.gtrack.hike-stops/store/hike-stops-store.module';

@NgModule({
  imports: [
    HikeStopsStoreModule,
    RoutePlannerStoreModule,
    EffectsModule.forFeature([Effects]),
    StoreModule.forFeature(featureName, reducer),
  ],
  providers: [Effects],
})
export class HikeEditorModule {}
