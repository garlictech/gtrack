import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GetMoonTimes, GetTimesResult } from 'suncalc';

import { AstronomyService } from '../../services/astronomy/astronomy.service';

@Component({
  selector: 'gtrack-sunrise',
  templateUrl: './sunrise.component.html',
})
export class SunriseComponent implements OnInit, OnChanges {
  @Input() position: Position;

  @Input() day: Date;

  astronomyData: {
    sun: GetTimesResult;
    moon: GetMoonTimes;
    moonPhase: string;
  };

  constructor(private readonly _astronomy: AstronomyService) {}

  ngOnInit(): void {
    this._refreshAstronomyData();
  }

  ngOnChanges(): void {
    this._refreshAstronomyData();
  }

  private _refreshAstronomyData(): void {
    this.astronomyData = {
      sun: this._astronomy.getSunTimes(this.position, this.day),
      moon: this._astronomy.getMoonTimes(this.position, this.day),
      moonPhase: this._astronomy.getMoonPhase(this.day),
    };
  }
}
