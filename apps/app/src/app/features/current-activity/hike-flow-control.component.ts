import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { IonicModule } from '@ionic/angular';
import { CurrentActivityActions } from './store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlayCircle,
  faPause,
  faHandPaper,
  faTrash,
} from '@fortawesome/pro-light-svg-icons';
import { Map, Control } from 'leaflet';

@Component({
  selector: 'gtrack-app-hike-flow-control',
  template: `
    <ion-fab vertical="bottom" horizontal="start">
      <ion-fab-button size="small" color="tertiary" mode="ios"
        ><ion-icon name="walk-outline"></ion-icon
      ></ion-fab-button>
      <ion-fab-list side="top">
        <ion-fab-button
          color="success"
          mode="ios"
          (click)="startActivity()"
          size="small"
          *ngIf="!isMoving"
        >
          <fa-icon [icon]="startIcon"> </fa-icon>
        </ion-fab-button>
        <ion-fab-button
          color="warning"
          mode="ios"
          (click)="pauseActivity()"
          size="small"
          *ngIf="isMoving"
        >
          <fa-icon [icon]="pauseIcon"> </fa-icon>
        </ion-fab-button>
        <ion-fab-button
          color="danger"
          mode="ios"
          (click)="stopActivity()"
          size="small"
          *ngIf="!isMoving"
        >
          <fa-icon [icon]="stopIcon"> </fa-icon>
        </ion-fab-button>
      </ion-fab-list>
      <ion-fab-list side="end">
        <ion-fab-button
          color="danger"
          mode="ios"
          (click)="clearActivity()"
          size="small"
        >
          <fa-icon [icon]="clearActivityIcon"> </fa-icon>
        </ion-fab-button>
      </ion-fab-list>
    </ion-fab>
  `,
  styleUrls: ['./hike-flow-control.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikeFlowControlComponent {
  @Input() isMoving = false;
  @Input() isSimulationMode = false;

  @Input() set map(map: Map) {
    const element = this.elRef.nativeElement;
    if (map) {
      const Custom = Control.extend({
        onAdd() {
          return element;
        },
      });

      this.control = new Custom({
        position: 'bottomleft',
      });

      this.control.addTo(map);
    }
  }

  @Output() activityCleared = new EventEmitter<boolean>();

  startIcon = faPlayCircle;
  stopIcon = faHandPaper;
  pauseIcon = faPause;
  clearActivityIcon = faTrash;
  public control: Control;

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly store: Store<any>, private elRef: ElementRef) {}

  startActivity(): void {
    this.store.dispatch(CurrentActivityActions.startMoving());
  }

  pauseActivity(): void {
    this.store.dispatch(CurrentActivityActions.pauseMoving());
  }

  stopActivity(): void {
    // alert: are you sure?
    this.store.dispatch(CurrentActivityActions.stopCurrentActivity());
  }

  clearActivity(): void {
    this.store.dispatch(CurrentActivityActions.resetCurrentActivity());
    this.activityCleared.emit(true);
  }
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  declarations: [HikeFlowControlComponent],
  imports: [CommonModule, IonicModule, FontAwesomeModule],
  exports: [HikeFlowControlComponent],
  providers: [],
})
export class HikeFlowControlComponentModule {}
