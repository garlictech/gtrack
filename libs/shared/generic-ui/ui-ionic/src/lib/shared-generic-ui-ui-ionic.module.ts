import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataComingComponent } from './components/data-coming.component';
import { IonicContentComponent } from './components/ionic-content/ionic-content.component';
import { ComponentBusyIndicatorComponent } from './components/component-busy-indicator.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, IonicModule, TranslateModule],
  declarations: [
    DataComingComponent,
    IonicContentComponent,
    ComponentBusyIndicatorComponent,
  ],
  exports: [
    DataComingComponent,
    IonicContentComponent,
    ComponentBusyIndicatorComponent,
  ],
})
export class SharedGenericUiUiIonicModule {}