import { Pipe, PipeTransform } from '@angular/core';
import { UnitsService } from '@bit/garlictech.angular.gtrack.customer';
import { UnitsFp } from '@bit/garlictech.universal.gtrack.units';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'distance',
  pure: false,
})
export class DistancePipe implements PipeTransform {
  constructor(private readonly units: UnitsService) {}

  transform(value: number): Observable<string> {
    return this.units.actualUnits$.pipe(
      map(actualUnits => {
        const converted = UnitsFp.convertDistance(value, actualUnits);

        return `${converted.value} ${converted.unit}`;
      })
    );
  }
}
