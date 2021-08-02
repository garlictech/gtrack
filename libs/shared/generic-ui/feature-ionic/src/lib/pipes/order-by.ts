import { Pipe, PipeTransform } from '@angular/core';
import { orderBy as _orderBy } from 'lodash';

@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  transform(
    array: any[],
    orderFields: string[],
    directions: (boolean | 'asc' | 'desc')[]
  ): string[] {
    return _orderBy(array, orderFields, directions);
  }
}
