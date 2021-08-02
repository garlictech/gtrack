import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coordinate',
})
export class CoordinatePipe implements PipeTransform {
  transform(value: number): number {
    return Math.round(value * 100000) / 100000.0;
  }
}
