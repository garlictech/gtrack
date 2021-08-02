import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'gtrack-app-no-activity',
  template: `
    <div
      class="text-center text-3xl "
      style="padding-top: var(--gtrack-header-height)"
    >
      {{ 'pages.activity.noActivitySelected' | translate }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoActivityComponent {}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  declarations: [NoActivityComponent],
  imports: [CommonModule, TranslateModule],
  exports: [NoActivityComponent],
  providers: [],
})
export class NoActivityComponentModule {}
