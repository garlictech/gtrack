import { NgModule } from '@angular/core';
// import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';
import { StoreModule } from '@ngrx/store';

import { DeviceOrientationService } from './services/device-orientation';
import { featureName, reducer } from './store';

@NgModule({
  imports: [StoreModule.forFeature(featureName, reducer)],
  // providers: [DeviceOrientation, DeviceOrientationService],
  providers: [DeviceOrientationService],
})
export class DeviceModule {}
