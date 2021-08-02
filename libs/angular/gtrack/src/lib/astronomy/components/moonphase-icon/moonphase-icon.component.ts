import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'gtrack-moonphase-icon',
  templateUrl: './moonphase-icon.component.html',
  styleUrls: ['./moonphase-icon.component.scss'],
})
export class MoonphaseIconComponent implements OnInit, OnChanges {
  @Input() phase: string;

  icon: string;

  private readonly _icons;

  constructor() {
    this._icons = {
      NewMoon: 'wi-moon-new',
      WaxingCrescent: 'wi-moon-waxing-crescent-1',
      FirstQuarter: 'wi-moon-first-quarter',
      WaxingGibbous: 'wi-moon-waxing-gibbous-1',
      FullMoon: 'wi-moon-full',
      WaningGibbous: 'wi-moon-waning-gibbous-1',
      LastQuarter: 'wi-moon-third-quarter',
      WaningCrescent: 'wi-moon-waning-crescent-1',
    };
  }

  ngOnInit(): void {
    this._refreshIcon();
  }

  ngOnChanges(): void {
    this._refreshIcon();
  }

  private _refreshIcon(): void {
    const icon = this._icons[this.phase];

    this.icon = `/assets/icons/weather/${icon}.svg`;
  }
}
