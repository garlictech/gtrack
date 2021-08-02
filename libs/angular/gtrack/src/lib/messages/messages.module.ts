import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedLocalizationFeatureIonicModule } from '@gtrack/shared/localization/feature-ionic';
import { IonicModule } from '@ionic/angular';
import { EntityDataService } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageDataService } from './services/message.data-service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedLocalizationFeatureIonicModule,
    CommonModule,
    StoreModule.forFeature('features.common.comment.messages', {}),
    EffectsModule.forFeature([]),
    IonicModule,
    TranslateModule,
  ],
  providers: [],
  declarations: [MessageListComponent],
  exports: [MessageListComponent],
})
export class MessagesModule {
  constructor(
    entityDataService: EntityDataService,
    messageDataService: MessageDataService
  ) {
    entityDataService.registerService('CommentMessage', messageDataService);
  }
}
