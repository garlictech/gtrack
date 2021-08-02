import * as O from 'fp-ts/lib/Option';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@gtrack/shared/generic-ui/data-access/pipes/pipes.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Component, OnInit, Input, NgModule } from '@angular/core';
import { PoiIconsFp } from '@bit/garlictech.universal.gtrack.poi-icons';
import { pipe } from 'fp-ts/lib/function';

const defaultIconType = 'asterisco';

@Component({
  selector: 'gtrack-app-poi-stamp',
  template: `
    <div
      class="magictime vanishIn text-center w-full flex flex-col justify-center items-center"
      [ngClass]="{ vanishOut: isAnimationOut, vanishIn: !isAnimationOut }"
    >
      <div
        class="component-title text-center text-3xl component-title truncate uppercase"
      >
        {{ title }}
      </div>
      <div class="img-container inline-flex justify-center items-center">
        <img [src]="iconUrl | trustedResource" class="inline-block" />
        <div
          name="checkmark-outline"
          class="component-shadow inline-block magictime absolute inset-auto text-6xl text-primary uppercase font-black transform rotate-45"
          *ngIf="!isCheckmarkHidden"
          [ngClass]="{ tinLeftIn: !isCheckmarkHidden }"
        >
          {{ 'features.currentActivity.poiPassed' | translate }}
        </div>
      </div>
    </div>
  `,
  styleUrls: [`./poi-stamp.scss`],
})
export class PoiStampComponent implements OnInit {
  @Input() title: string;
  @Input() iconType: string;

  iconUrl = defaultIconType;
  isAnimationOut = false;
  isCheckmarkHidden = true;

  ngOnInit(): void {
    this.iconUrl = pipe(
      PoiIconsFp.getIcon(this.iconType || defaultIconType),
      O.map(icon => icon.url),
      O.getOrElse(() => '')
    );
    setTimeout(() => (this.isAnimationOut = true), 5000);
    setTimeout(() => (this.isCheckmarkHidden = false), 2000);
  }
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  declarations: [PoiStampComponent],
  imports: [CommonModule, PipesModule, IonicModule, TranslateModule],
  exports: [PoiStampComponent],
  providers: [],
})
export class PoiStampComponentModule {}
