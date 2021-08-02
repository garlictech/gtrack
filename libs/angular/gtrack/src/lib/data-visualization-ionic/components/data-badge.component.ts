import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import * as fp from 'lodash/fp';

@Component({
  selector: 'gtrack-data-badge',
  template: `
    <div class="font-bold uppercase w-full" *ngIf="dataValid()">
      <ion-icon name="{{ iconName }}" class="text-2xl lg:text-xl"></ion-icon>
      <div class="lg:text-xs whitespace-nowrap" [style.color]="color">
        <ng-content></ng-content>
      </div>
      <div
        class="text-xs uppercase font-normal whitespace-nowrap"
        *ngIf="dataLabel"
      >
        {{ dataLabel | translate }}
      </div>
    </div>
  `,
  styleUrls: ['./data-badge.scss'],
})
export class DataBadgeComponent {
  @Input() dataLabel: string;
  @Input() iconName: string;
  @Input() data?: any;
  @Input() mustBeValidated = false;
  @Input() color = 'var(--ion-color-primary)';

  dataValid(): boolean {
    return this.mustBeValidated
      ? !fp.isNil(this.data) && Math.floor(this.data) !== 0
      : true;
  }
}

@NgModule({
  imports: [IonicModule, TranslateModule, CommonModule],
  exports: [DataBadgeComponent],
  declarations: [DataBadgeComponent],
  providers: [],
})
export class DataBadgeComponentModule {}
