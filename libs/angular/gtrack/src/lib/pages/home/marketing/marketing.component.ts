import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'gtrack-common-marketing',
  template: `
    <div class="text-center text-primary">
      <div
        class="uppercase font-black text-3xl slogan"
        [innerHTML]="'marketing.mainTitles.first' | translate"
      ></div>
    </div>
  `,
  styleUrls: ['marketing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingComponent {}

@NgModule({
  imports: [TranslateModule],
  declarations: [MarketingComponent],
  exports: [MarketingComponent],
})
export class MarketingModule {}
