import { Injectable } from '@angular/core';
import { kebabCase as _kebabCase } from 'lodash';
import { getMoonIllumination, getMoonTimes, getTimes } from 'suncalc';

export enum EMoonPhases {
  NewMoon = 0,
  WaxingCrescent = 1,
  FirstQuarter = 2,
  WaxingGibbous = 3,
  FullMoon = 4,
  WaningGibbous = 5,
  LastQuarter = 6,
  WaningCrescent = 7,
}

@Injectable()
export class AstronomyService {
  getSunTimes(position: Position, date = new Date()): any {
    return getTimes(date, position[1], position[0]);
  }

  getMoonTimes(position: Position, date = new Date()): any {
    return getMoonTimes(date, position[1], position[0]);
  }

  getMoonIconName(): string {
    const phase = this.getMoonPhase();

    return _kebabCase(phase);
  }

  getMoonPhase(date = new Date()): string {
    const illumination = getMoonIllumination(date);
    let value = Math.round(illumination.phase * 8);

    if (value === 8) {
      value = 7;
    }

    return EMoonPhases[value];
  }
}
