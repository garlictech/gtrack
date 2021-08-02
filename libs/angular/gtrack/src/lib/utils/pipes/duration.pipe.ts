import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

const padLeft = (str: string, length: number, chars: string): string => {
  const padLength = length - str.length;
  let pad = '';

  for (let i = 0; i < padLength; i++) {
    pad += chars;
  }

  return `${pad}${str}`;
};

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(durationInUnit: number, unit: any = 'minutes'): string {
    const duration = moment.duration(durationInUnit, unit);
    const days = duration.days() || 0;
    const hours = padLeft((duration.hours() + 24 * days).toString(), 2, '0');
    const minutes = padLeft(duration.minutes().toString(), 2, '0');

    if (unit === 'seconds') {
      const seconds = padLeft(duration.seconds().toString(), 2, '0');
      return `${hours}:${minutes}:${seconds} h`;
    } else {
      return `${hours}:${minutes} h`;
    }
  }
}
