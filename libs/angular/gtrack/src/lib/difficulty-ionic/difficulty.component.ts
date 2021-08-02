import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { DifficultyFp } from '@bit/garlictech.universal.gtrack.difficulty';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import * as fp from 'lodash/fp';

@Component({
  selector: 'gtrack-difficulty',
  template: `
    <div class="px-1">
      <ion-icon
        *ngFor="let color of colors()"
        [ngStyle]="{ color: color }"
        name="fitness"
      ></ion-icon>
    </div>
  `,
})
export class DifficultyComponent {
  @Input() difficulty?: number;

  colors(): string[] {
    return fp.concat(
      // Calculate the colored dots
      fp.flow(
        fp.add(1),
        fp.range(0),
        fp.map(DifficultyFp.getColor)
      )(this.difficulty as number),
      // Calculate the "grey" dots
      Array(DifficultyFp.getMaxDifficultyValue() - (this.difficulty as number)).fill(
        '#aaaaaa'
      )
    );
  }
}

@NgModule({
  imports: [TranslateModule, CommonModule, IonicModule],
  exports: [DifficultyComponent],
  declarations: [DifficultyComponent],
  providers: [],
})
export class DifficultyComponentModule {}
