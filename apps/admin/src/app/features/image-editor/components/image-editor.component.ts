import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { Image } from '@bit/garlictech.universal.gtrack.graphql-api';
import { ImageService } from '@bit/garlictech.angular.gtrack.image';
import { Observable } from 'rxjs';
import { AdminImageListModule } from './image-list.component';
import { NbAccordionModule } from '@nebular/theme';

@Component({
  selector: 'gtrack-admin-image-editor',
  template: `
    <nb-accordion>
      <nb-accordion-item>
        <nb-accordion-item-header>Allowed images</nb-accordion-item-header>
        <nb-accordion-item-body>
          <gtrack-admin-image-list
            [images]="allowedImages$ | async"
          ></gtrack-admin-image-list>
        </nb-accordion-item-body>
      </nb-accordion-item>
      <nb-accordion-item>
        <nb-accordion-item-header>Banned images</nb-accordion-item-header>
        <nb-accordion-item-body>
          <gtrack-admin-image-list
            [images]="bannedImages$ | async"
          ></gtrack-admin-image-list>
        </nb-accordion-item-body>
      </nb-accordion-item>
    </nb-accordion>
    <!-- <p-accordion [multiple]="true">
      <p-accordionTab header="Allowed images">
        <gtrack-admin-image-list
          [images]="allowedImages$ | async"
        ></gtrack-admin-image-list>
      </p-accordionTab>
      <p-accordionTab header="Banned images">
        <gtrack-admin-image-list
          [images]="bannedImages$ | async"
        ></gtrack-admin-image-list>
      </p-accordionTab>
    </p-accordion> -->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminImageEditorComponent {
  allowedImages$: Observable<Image[]>;
  bannedImages$: Observable<Image[]>;

  constructor(private readonly imageService: ImageService) {
    this.allowedImages$ = this.imageService.allowedImages$;
    // this.bannedImages$ = this.imageService.bannedImages$;
  }
}

@NgModule({
  imports: [CommonModule, AdminImageListModule, NbAccordionModule],
  exports: [AdminImageEditorComponent],
  declarations: [AdminImageEditorComponent],
})
export class AdminImageEditorModule { }