import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ActivityPageComponent } from './activity.page';
import { CurrentActivityModule } from '@app/features/current-activity/current-activity.module';
import { IonicContentModule } from '@gtrack/shared/generic-ui/data-access/ionic-content.component';
import { CurrentActivityComponentModule } from '@app/features/current-activity/current-activity/current-activity.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityPageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    CurrentActivityComponentModule,
    IonicModule,
    RouterModule.forChild(routes),
    CurrentActivityModule,
    IonicContentModule,
  ],
  declarations: [ActivityPageComponent],
})
export class ActivityPageModule {}
