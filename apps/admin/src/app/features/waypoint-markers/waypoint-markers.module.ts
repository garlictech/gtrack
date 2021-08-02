import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { Effects } from './store';

@NgModule({
  imports: [EffectsModule.forFeature([Effects])],
  providers: [Effects],
})
export class WaypointMarkersModule {}
