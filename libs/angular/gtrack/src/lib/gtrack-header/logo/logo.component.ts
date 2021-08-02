import { Component, NgModule, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gtrack-logo',
  template: `
    <div class="beta" routerLink="/">
      <!-- <img src="/assets/img/logo.svg" class="pr-2" /> -->
      <div class="logo text-2xl">g<span class="t-letter">t</span>rack</div>
      <div
        *ngIf="betaBadgeShown"
        class="bg-danger leading-none text-white border rounded border-solid border-danger border-2"
      >
        BETA
      </div>
    </div>
  `,
  styleUrls: ['./style.scss'],
})
export class LogoComponent {
  @Input() betaBadgeShown = false;
}

@NgModule({
  imports: [AngularSvgIconModule, RouterModule, CommonModule],
  exports: [LogoComponent],
  declarations: [LogoComponent],
  providers: [],
})
export class LogoComponentModule {}
