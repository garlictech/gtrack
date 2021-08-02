import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TabsComponent } from './tabs.component';
import { TabsPageRoutingModule } from './tabs.routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    IonicModule,
    TabsPageRoutingModule,
  ],
  declarations: [TabsComponent],
  exports: [TabsComponent],
})
export class TabsModule {}
