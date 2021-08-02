import { Component, NgModule } from '@angular/core';
import {
  AuthorizationService,
  AccessLevel,
  AuthorizationModule,
} from '@bit/garlictech.angular.gtrack.authorization';
import { CommonModule } from '@angular/common';
import { handler } from 'rx-handler';
import { IonicModule } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EAuthRoles } from '@gtrack/shared/authentication/data-access';

@UntilDestroy()
@Component({
  selector: 'gtrack-bookmark-button',
  template: `
    <ion-fab-button size="small" (click)="onClick($event)" class="m-auto my-1">
      <ion-icon
        [name]="isBookmarked ? 'bookmark' : 'bookmark-outline'"
        class="text-3xl"
      ></ion-icon>
    </ion-fab-button>
  `,
  styleUrls: ['./bookmark-button.component.scss'],
})
export class BookmarkButtonComponent {
  onClick = handler();
  isBookmarked = false;

  constructor(private readonly authorizationService: AuthorizationService) {
    from(this.onClick)
      .pipe(
        switchMap(() =>
          this.authorizationService.authorizedCall$(
            () => (this.isBookmarked = !this.isBookmarked),
            AccessLevel.AUTHENTICATED,
            EAuthRoles.user
          )
        ),
        untilDestroyed(this)
      )
      .subscribe();
  }
}
@NgModule({
  imports: [CommonModule, IonicModule, AuthorizationModule],
  exports: [BookmarkButtonComponent],
  declarations: [BookmarkButtonComponent],
  providers: [],
})
export class BookmarkButtonComponentModule {}
