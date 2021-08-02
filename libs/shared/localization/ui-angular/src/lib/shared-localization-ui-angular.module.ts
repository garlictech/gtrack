import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMdModule } from 'ngx-md';
import { DescriptionComponent } from './description/description.component';
import { HtmlDescriptionComponent } from './html-description/html-description.component';
import { MarkdownDescriptionComponent } from './markdown-description/markdown-description.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedLocalizationFeatureIonicModule} from '../../../feature-ionic/src/';

@NgModule({
  imports: [CommonModule, NgxMdModule, TranslateModule, SharedLocalizationFeatureIonicModule],
  exports: [HtmlDescriptionComponent, MarkdownDescriptionComponent, DescriptionComponent],
  declarations: [
    DescriptionComponent,
    HtmlDescriptionComponent,
    MarkdownDescriptionComponent,
  ],
})
export class SharedLocalizationUiAngularModule {}
