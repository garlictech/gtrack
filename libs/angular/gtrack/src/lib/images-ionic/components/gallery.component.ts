import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'gtrack-gallery',
  template: `
    <div class="overflow-x-scroll block">
      <ng-container *ngFor="let url of imageUrls">
        <img
          *ngIf="!!url"
          [src]="url"
          class="inline-block border-solid rounded mr-4 last:mr-0 h-64"
          onerror="this.style.display='none'"
        />
      </ng-container>
    </div>
  `,
  styleUrls: ['./gallery.scss'],
})
export class GalleryComponent {
  @Input() imageUrls: string[];

  constructor() {
    this.imageUrls = [];
  }
}

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [GalleryComponent],
  declarations: [GalleryComponent],
})
export class GalleryComponentModule {}
