import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';

@Component({
  selector: 'gtrack-hike-stop-info',
  templateUrl: './hike-stop-info.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikeExternalPoiInfoComponent {
  @Input() poi;

  trackByFn(index: number): number {
    return index;
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [HikeExternalPoiInfoComponent],
  declarations: [HikeExternalPoiInfoComponent],
})
export class HikePoiInfoModule {}
