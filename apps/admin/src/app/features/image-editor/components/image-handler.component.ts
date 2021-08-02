import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule
} from '@angular/core';
import { Image } from '@bit/garlictech.universal.gtrack.graphql-api';
import { ImageService } from '@bit/garlictech.angular.gtrack.image';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { handler } from 'rx-handler';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@UntilDestroy()
@Component({
  selector: 'gtrack-admin-image-handler',
  template: `
    <img [src]="image.thumbnail.url" class="rounded" />
    <div
      class="flex flex-row justify-between py-2 text-3xl bg-red-900"
      *ngIf="image"
    >
      <div class="uppercase text-xs">
        Source: {{ image.sourceObject.objectType }}
      </div>
      <nb-icon
        nbPrefix
        icon="trash-outline"
        pack="eva"
        *ngIf="!image.banned"
        (click)="onBan()"
        class="cursor-pointer"
      ></nb-icon>

      <nb-icon
        nbPrefix
        icon="checkmark-circle-2-outline"
        pack="eva"
        *ngIf="image.banned"
        (click)="onUnban()"
        class="cursor-pointer"
      ></nb-icon>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminImageHandlerComponent {
  @Input() image: Image;

  onBan = handler();
  onUnban = handler();

  constructor(private readonly imageService: ImageService) {
    from(this.onBan)
      .pipe(
        untilDestroyed(this),
        switchMap(() => this.imageService.update({ id: this.image.id }))
      )
      .subscribe();

    from(this.onUnban)
      .pipe(
        untilDestroyed(this),
        switchMap(() => this.imageService.update({ id: this.image.id }))
      )
      .subscribe();
  }
}

@NgModule({
  imports: [CommonModule, NbEvaIconsModule],
  exports: [AdminImageHandlerComponent],
  declarations: [AdminImageHandlerComponent]
})
export class AdminImageHandlerModule { }
