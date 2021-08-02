import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdateService } from '@bit/garlictech.angular.gtrack.pwa-tools';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { GenericUiSelectors } from '@gtrack/shared/generic-ui/data-access';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'gtrack-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked {
  backgroundImageUrl$: Observable<string | undefined>;
  private previousPath = '';

  constructor(
    private readonly swUpdate: SwUpdateService,
    private changeRef: ChangeDetectorRef,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>
  ) {
    this.backgroundImageUrl$ = this.store
      .select(GenericUiSelectors.currentBackgroundImageSelector)
      .pipe(shareReplay(1));
  }

  ngAfterViewChecked(): void {
    this.changeRef.detectChanges();
  }

  getPageTransition(routerOutlet: RouterOutlet) {
    if (routerOutlet.isActivated) {
      let transitionName = 'section';

      const path = routerOutlet.activatedRoute.routeConfig?.path;
      const isSame = this.previousPath === path;
      const isBackward = !!path && this.previousPath.startsWith(path);
      const isForward = path?.startsWith(this.previousPath);

      if (isSame) {
        transitionName = 'none';
      } else if (isBackward && isForward) {
        transitionName = 'initial';
      } else if (isBackward) {
        transitionName = 'backward';
      } else if (isForward) {
        transitionName = 'forward';
      }

      this.previousPath = path || '';

      return transitionName;
    } else return null;
  }
  ngOnInit(): void {
    this.swUpdate.start();
  }
}