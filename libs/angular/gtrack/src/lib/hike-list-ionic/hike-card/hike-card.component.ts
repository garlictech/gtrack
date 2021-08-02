import * as O from 'fp-ts/lib/Option';
import { CommonModule } from '@angular/common';
import { ImageModule } from '@bit/garlictech.angular.gtrack.image';
import {
  Component,
  Input,
  NgModule,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { HikeDetailsResolverService } from '@bit/garlictech.angular.gtrack.hike-details';
import { ImageFp } from '@bit/garlictech.universal.gtrack.image';
import { SharedLocalizationFeatureIonicModule } from '@gtrack/shared/localization/feature-ionic';
import { PipesModule, SharedGenericUiFeatureIonicModule } from '@gtrack/shared/generic-ui/feature-ionic';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils/utils.module';
import { DataBadgeComponentModule } from '@bit/garlictech.angular.gtrack.data-visualization-ionic';
import { DifficultyComponentModule } from '@bit/garlictech.angular.gtrack.difficulty-ionic';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { shareReplay, switchMap, tap, take } from 'rxjs/operators';
import {
  RouteForUi,
  RouteForUiFp,
} from '@bit/garlictech.angular.gtrack.route-ui';
import { pipe } from 'fp-ts/lib/function';
import { BookmarkButtonComponentModule } from '@bit/garlictech.angular.gtrack.customer';
import { SettingsSharedGenericUiDataAccessModule } from '../../customer/settings-pipes.module';

@UntilDestroy()
@Component({
  selector: 'gtrack-hike-card',
  templateUrl: './hike-card.component.html',
  styleUrls: ['./hike-card.styles.scss'],
})
export class HikeCardComponent implements OnInit {
  imageUrl?: string;
  placeholderImageUrl: string;
/*   elevationImageUrl: string | undefined;
 */  getNextImageNotifier = new Subject<boolean>();

  @Input() hike: CalculatedHike;

  constructor(
    private readonly hikeDetailsResolver: HikeDetailsResolverService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    /* const route: O.Option<RouteForUi | null> = RouteForUiFp.fromRoute(this.hike.route);
    this.placeholderImageUrl = pipe(
      route,
      O.map(route => route.routeIcon),
      O.getOrElse(() => null)
    );

    this.elevationImageUrl = pipe(
      route,
      O.map(route => route.elevationIcon),
      O.getOrElse(() => undefined)
    ); */

    const imageUrlProvider$ = this.hikeDetailsResolver
      .resolveImages(this.hike)
      .pipe(shareReplay(1));

    this.getNextImageNotifier
      .pipe(
        switchMap(() => ImageFp.randomImageBackground(imageUrlProvider$)),
        take(1),
        tap(({ fullsizeUrl }) => {
          this.imageUrl = fullsizeUrl;
          this.cdr.detectChanges();
        }),
        untilDestroyed(this)
      )
      .subscribe();

    this.getNextImageNotifier.next(true);
  }
  onImageLoaded(isFallback: boolean): void {
    if (isFallback) {
      this.imageUrl = undefined;
      this.getNextImageNotifier.next(true);
    }
  }
}

@NgModule({
  imports: [
    DataBadgeComponentModule,
    DifficultyComponentModule,
    IonicModule,
    CommonModule,
    SharedLocalizationFeatureIonicModule,
    SharedGenericUiFeatureIonicModule,
    SettingsSharedGenericUiDataAccessModule,
    UtilsModule,
    RouterModule,
    ImgFallbackModule,
    ImageModule,
    TranslateModule,
    BookmarkButtonComponentModule,
    PipesModule
  ],
  exports: [HikeCardComponent],
  declarations: [HikeCardComponent],
  providers: [],
})
export class HikeCardComponentModule {}
