import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChallengesPageComponent } from './challenges.page';
import { CommonHeaderModule } from '@bit/garlictech.angular.gtrack.gtrack-header';

const routes: Routes = [
  {
    path: '',
    component: ChallengesPageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CommonHeaderModule,
  ],
  declarations: [ChallengesPageComponent],
})
export class ChallengesPageModule {}
