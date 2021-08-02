import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { IonicModule } from '@ionic/angular';
import { CurrentActivityActions } from './store';
import { CurrentActivity } from './types';

@Component({
  selector: 'gtrack-app-hike-activity-control',
  template: `
    <ion-fab-button
      color="success"
      mode="ios"
      size="small"
      (click)="startActivity()"
    >
      <ion-icon name="walk-outline"></ion-icon>
    </ion-fab-button>
  `,
  styleUrls: ['./hike-activity-control.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikeActivityControlComponent {
  @Input() activity: CurrentActivity;

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly store: Store<any>) {}

  startActivity(): void {
    this.store.dispatch(
      CurrentActivityActions.startActivity({ currentActivity: this.activity })
    );
  }
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  declarations: [HikeActivityControlComponent],
  imports: [CommonModule, IonicModule],
  exports: [HikeActivityControlComponent],
  providers: [],
})
export class HikeActivityControlComponentModule {}
