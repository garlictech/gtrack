import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Observable, of } from 'rxjs';

//import { SpeedEditorComponent } from './editor/speed-editor.component';
//import { StartDateTimeEditorComponent } from './editor/start-date-time-editor.component';

@Injectable({ providedIn: 'root' })
export class HikeCustomerService {
  constructor(public popoverController: PopoverController) {}

  getNewStartDateFromPopover(startDate: Date): Observable<Date> {
    /*   return from(
      this.popoverController.create({
        component: StartDateTimeEditorComponent,
        componentProps: { startDate },
      })
    ).pipe(
      tap(popover => popover.present()),
      switchMap(popover => from(popover.onDidDismiss())),
      pluck('data', 'startDate'),
      filter(x => !!x)
    );
    */
    return of(new Date());
  }

  getNewSpeedFromPopover(speed: number): Observable<number> {
    /*return from(
      this.popoverController.create({
        component: SpeedEditorComponent,
        componentProps: { speed },
      })
    ).pipe(
      tap(popover => popover.present()),
      switchMap(popover => from(popover.onDidDismiss())),
      pluck('data', 'speed'),
      filter(x => !!x)
    );
    */
    return of(4);
  }
}
