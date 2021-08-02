import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Image } from '@bit/garlictech.universal.gtrack.graphql-api';
import { AdminImageHandlerModule } from './image-handler.component';

@Component({
  selector: 'gtrack-admin-image-list',
  template: `
    <div class="flex flex-wrap items-center justify-center">
      <gtrack-admin-image-handler
        *ngFor="let image of images"
        [image]="image"
        class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 bg-gray-300 m-2"
      ></gtrack-admin-image-handler>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminImageListComponent {
  @Input() images: Image[];
}

@NgModule({
  imports: [CommonModule, FormsModule, AdminImageHandlerModule],
  exports: [AdminImageListComponent],
  declarations: [AdminImageListComponent]
})
export class AdminImageListModule {}

