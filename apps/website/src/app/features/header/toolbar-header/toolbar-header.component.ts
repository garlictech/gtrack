import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { handler } from 'rx-handler';
import { IonicModule, IonRouterOutlet } from '@ionic/angular';
import { HeaderControllerService } from '../header.controller';
import { CommonHeaderModule } from '@bit/garlictech.angular.gtrack.gtrack-header';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SharedLocalizationDataAccessModule } from '@gtrack/shared/localization/data-access';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'gtrack-toolbar-header',
  templateUrl: `./toolbar-header.component.html`,
  styleUrls: ['./toolbar-header.style.scss'],
})
export class ToolbarHeaderComponent {
  isLoggedIn = false;
  onCogClick = handler();

  constructor(
    private readonly routerOutlet: IonRouterOutlet,
    private readonly headerController: HeaderControllerService
  ) {
    from(this.onCogClick)
      .pipe(
        untilDestroyed(this),
        switchMap(() =>
          this.headerController.showSettings(this.routerOutlet.nativeEl)
        )
      )
      .subscribe();
  }
}

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    IonicModule,
    CommonHeaderModule,
    SharedLocalizationDataAccessModule,
    TranslateModule,
  ],
  exports: [ToolbarHeaderComponent],
  declarations: [ToolbarHeaderComponent],
  providers: [],
})
export class ToolbarHeaderModule {}
