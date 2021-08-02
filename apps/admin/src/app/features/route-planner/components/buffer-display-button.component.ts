import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';
import { GtrackDefaults } from '@bit/garlictech.universal.gtrack.defaults/defaults';
import { Store } from '@ngrx/store';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { finalize, pluck } from 'rxjs/operators';
import { EBuffer } from '@bit/garlictech.universal.gtrack.route-segment';
import * as fromActions from '../store/actions';
import { NbToggleModule } from '@nebular/theme';

@UntilDestroy()
@Component({
  selector: 'gtrack-buffer-display-button',
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <div class="flex flex-row content-center">
      <!-- <label class="pr-2">{{ label }}</label> -->
      <nb-toggle (onChange)="bufferDisplayHandler.next($event)">{{
        label
      }}</nb-toggle>
      <!-- <p-inputSwitch (onChange)="bufferDisplayHandler.next($event)">
      </p-inputSwitch> -->
    </div>
  `,
})
export class BufferDisplayButtonComponent implements OnInit {
  @Input() set whichBuffer(value: string) {
    this._whichBuffer = EBuffer[value];
  }

  label: string;
  bufferDisplayHandler: Subject<boolean>;

  private _whichBuffer: EBuffer;

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly store: Store<any>) {
    this.bufferDisplayHandler = new Subject();

    this.bufferDisplayHandler
      .pipe(
        untilDestroyed(this),
        pluck('checked'),
        finalize(() =>
          this.store.dispatch(
            fromActions.hideBuffer({ whichBuffer: this._whichBuffer })
          )
        )
      )
      .subscribe((shouldDisplayBuffer: boolean) => {
        this.store.dispatch(
          shouldDisplayBuffer
            ? fromActions.displayBufferOnMap({ whichBuffer: this._whichBuffer })
            : fromActions.hideBuffer({ whichBuffer: this._whichBuffer })
        );
      });
  }

  ngOnInit(): void {
    this.label =
      (this._whichBuffer === EBuffer.SMALL
        ? GtrackDefaults.smallRouteBufferSize()
        : GtrackDefaults.bigRouteBufferSize()
      ).toString() + ' m buffer';
  }
}

@NgModule({
  imports: [NbToggleModule],
  exports: [BufferDisplayButtonComponent],
  declarations: [BufferDisplayButtonComponent],
})
export class BufferDisplayButtonModule { }
