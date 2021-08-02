import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, IonRouterOutlet, Platform } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { CustomerStoreModule } from '@bit/garlictech.angular.gtrack.customer/store';

@UntilDestroy()
@Component({
  selector: 'gtrack-common-header',
  templateUrl: 'common-header.html',
  styleUrls: ['./common-header.scss'],
})
@UntilDestroy()
export class CommonHeaderComponent implements OnInit, OnDestroy {
  previousUrl: string;
  canGoBack: boolean;
  isApp: boolean;
  private currentUrl: string;

  constructor(
    private ionRouterOutlet: IonRouterOutlet,
    private router: Router,
    private readonly _platform: Platform
  ) {
    this.isApp =
      this._platform.is('capacitor') ||
      this._platform.is('ios') ||
      this._platform.is('android') ||
      this._platform.is('hybrid');
  }

  ngOnInit(): void {
    this.canGoBack = this.ionRouterOutlet.canGoBack();
    this.currentUrl = this.router.url;
    this.router.events.pipe(untilDestroyed(this)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  ngOnDestroy(): void {
    /* EMPTY */
  }
}

@NgModule({
  imports: [CommonModule, IonicModule, CustomerStoreModule],
  exports: [CommonHeaderComponent],
  declarations: [CommonHeaderComponent],
  providers: [],
})
export class CommonHeaderModule {}
