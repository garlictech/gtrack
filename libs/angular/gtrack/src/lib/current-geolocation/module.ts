import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { CurrentGeoLocationComponent } from './components';

import { CurrentGeolocationStoreModule } from './store';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CurrentGeoLocationComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    CurrentGeolocationStoreModule,
    IonicModule,
  ],
})
export class CurrentGeolocationModule {}
