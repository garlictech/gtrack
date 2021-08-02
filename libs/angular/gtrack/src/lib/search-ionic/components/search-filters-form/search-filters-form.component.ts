import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  SearchFilterActions,
  SearchFilters,
  SearchFiltersSelectors,
} from '@bit/garlictech.angular.gtrack.search';
import { UnitsService } from '@bit/garlictech.angular.gtrack.customer';
import { LengthUnit, UnitsFp } from '@bit/garlictech.universal.gtrack.units';
import { select, Store } from '@ngrx/store';
import * as fp from 'lodash/fp';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { combineLatest, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

const maxWalkDistanceInMeters = 50000;
const maxSearchRadius = 50000;

@UntilDestroy()
@Component({
  selector: 'gtrack-search-filters-form',
  templateUrl: './search-filters-form.component.html',
  styleUrls: ['./search-filter-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFiltersFormComponent {
  filterForm$: Observable<FormGroup>;
  bigUnit$: Observable<string>;
  maxWalkDistance$: Observable<number>;
  maxSearchRadius$: Observable<number>;
  currentWalkDistance$: Observable<number[]>;
  currentRadius$: Observable<number>;
  maxWalkTimeInHours = 24;

  constructor(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly unitsService: UnitsService
  ) {
    this.bigUnit$ = this.unitsService.actualUnits$.pipe(
      map(actualUnits => actualUnits.bigUnit),
      shareReplay(1)
    );

    this.filterForm$ = this.store.pipe(
      select(SearchFiltersSelectors.getFilters),
      filter(filters => !!filters),
      take(1),
      withLatestFrom(this.unitsService.actualUnits$),
      map(
        ([filters, actualUnits]) =>
          new FormGroup({
            radius: new FormControl(
              Math.floor(
                UnitsFp.convertDistanceInBigUnit(filters.radius, actualUnits)
                  .value
              )
            ),
            difficulty: new FormControl({
              lower: filters.difficulty[0],
              upper: filters.difficulty[1],
            }),
            length: new FormControl({
              lower: UnitsFp.convertDistanceInBigUnit(
                filters.length[0],
                actualUnits
              ).value,
              upper: UnitsFp.convertDistanceInBigUnit(
                filters.length[1] || maxWalkDistanceInMeters,
                actualUnits
              ).value,
            }),
            time: new FormControl({
              lower: Math.floor(filters.time[0] / 60),
              upper: Math.floor(
                filters.time[1] ? filters.time[1] / 60 : this.maxWalkTimeInHours
              ),
            }),
          })
      ),
      shareReplay(1)
    );

    this.filterForm$
      .pipe(
        untilDestroyed(this),
        switchMap(filterForm => filterForm.valueChanges),
        debounceTime(250),
        distinctUntilChanged(fp.isEqual),
        withLatestFrom(this.unitsService.actualUnits$),
        tap(([formValue, actualUnits]) => {
          const walkDistanceMax = UnitsFp.convertBigUnitToMeter(
            formValue.length.upper,
            actualUnits
          );

          this.store.dispatch(
            SearchFilterActions.ChangeFilters({
              radius: UnitsFp.convertBigUnitToMeter(
                formValue.radius,
                actualUnits
              ),
              difficulty: [
                formValue.difficulty.lower,
                formValue.difficulty.upper,
              ],
              length: [
                UnitsFp.convertBigUnitToMeter(
                  formValue.length.lower,
                  actualUnits
                ),
                // udefined means "bigger than max walk distance"
                walkDistanceMax >= maxWalkDistanceInMeters
                  ? 0 // fixed to null -- it was undefined before
                  : walkDistanceMax,
              ],
              time: [
                formValue.time.lower * 60,
                // udefined means "bigger than max walk time"
                formValue?.time?.upper >= this.maxWalkTimeInHours
                  ? 0 // fixed to null -- it was undefined before
                  : formValue.time.upper * 60,
              ],
            })
          );
        })
      )
      .subscribe();

    const maxDistanceCalc$ = maxDistance =>
      this.unitsService.actualUnits$.pipe(
        map(
          actualUnits =>
            UnitsFp.convertDistanceInBigUnit(maxDistance, actualUnits).value
        ),
        shareReplay(1)
      );

    this.maxWalkDistance$ = maxDistanceCalc$(maxWalkDistanceInMeters);
    this.maxSearchRadius$ = maxDistanceCalc$(maxSearchRadius);

    const filtersWithCurrentUnits$ = (
      filterGetter: (filters: SearchFilters) => any
    ) =>
      combineLatest([
        this.store.pipe(select(SearchFiltersSelectors.getFilters)),
        this.unitsService.actualUnits$,
      ]).pipe(
        map(([filters, actualUnits]) => [filterGetter(filters), actualUnits]),
        distinctUntilChanged(fp.isEqual)
      );

    this.currentWalkDistance$ = filtersWithCurrentUnits$(
      filters => filters.length
    )
      .pipe(
        map(([value, actualUnits]: [[number, number], LengthUnit]) => [
          UnitsFp.convertDistanceInBigUnit(value[0], actualUnits).value,
          UnitsFp.convertDistanceInBigUnit(value[1], actualUnits).value,
        ]
        ),
        shareReplay(1)
      );

    this.currentRadius$ = filtersWithCurrentUnits$(
      filters => filters.radius
    ).pipe(
      map(
        ([radius, actualUnits]: [number, LengthUnit]) =>
          UnitsFp.convertDistanceInBigUnit(radius, actualUnits).value
      ),
      shareReplay(1)
    );
  }
}
