import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'obj2arr' })
export class ObjectToArrayPipe implements PipeTransform {
  transform(obj: Record<string, unknown>): any {
    const keys: any[] = [];

    if (typeof obj === 'object' && Object.keys(obj).length) {
      for (const key in obj) {
        if (obj[key]) {
          const item = {
            key,
            value: obj[key],
          };
          keys.push(item);
        }
      }
    }

    return keys;
  }
}
