import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { Observable } from 'rxjs';
import { HikeCardComponentModule } from '../hike-card/hike-card.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'gtrack-hike-card-list',
  template: `
    <div class="inline-block w-full md:w-auto">
      <div class="w-full flex flex-col justify-center">
        <div
          class="inline-grid w-full"
          [ngClass]="{
            'multiple-columns': !column,
            'single-column': column,
            horizontal: !vertical
          }"
        >
          <div
            *ngFor="
              let hike of hikes$ | async;
              let i = index;
              trackBy: trackByFn
            "
          >
            <gtrack-hike-card
              [hike]="hike"
              class="inline-block w-full p-2"
            ></gtrack-hike-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./hike-card-list.component.scss'],
})
export class HikeCardListComponent {
  @Input() hikes$: Observable<CalculatedHike[]>;
  @Input() vertical = false;
  @Input() column = false;

  @Output() mouseenterCard = new EventEmitter<CalculatedHike>();
  @Output() mouseleaveCard = new EventEmitter<void>();

  onMouseenter(hike: CalculatedHike): void {
    this.mouseenterCard.emit(hike);
  }

  onMouseleave(): void {
    this.mouseenterCard.emit();
  }

  trackByFn(index: number): number {
    return index;
  }
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [HikeCardComponentModule, CommonModule, IonicModule],
  exports: [HikeCardListComponent],
  declarations: [HikeCardListComponent],
  providers: [],
})
export class HikeCardListComponentModule {}
