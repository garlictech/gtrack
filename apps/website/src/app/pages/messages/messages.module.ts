import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MessagesModule } from '@bit/garlictech.angular.gtrack.messages';
import { MessageListComponent } from '@bit/garlictech.angular.gtrack.messages/components';
import { MessagesPageComponent } from './messages.page';

const routes: Routes = [
  {
    path: ':type/:id',
    component: MessageListComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessagesModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  declarations: [MessagesPageComponent],
})
export class MessagesPageModule {}
