import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LengthUnit, units } from '@bit/garlictech.universal.gtrack.units';
import { CustomerSelectors } from '../store';

@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  readonly actualUnits$: Observable<LengthUnit>;

  constructor(protected _store: Store) {
    this.actualUnits$ = this._store.pipe(
      select(CustomerSelectors.selectSettings),
      map(settings =>
        settings?.lengthUnit
          ? units.length[settings.lengthUnit]
          : units.length.metric
      ),
      shareReplay(1)
    );
  }
}
