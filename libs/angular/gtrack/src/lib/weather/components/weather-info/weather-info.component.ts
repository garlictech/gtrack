import { Component } from '@angular/core';

@Component({
  selector: 'gtrack-common-weather-info',
  template: '',
})
export class WeatherInfoComponent /*implements OnInit, OnChanges*/ {
  /* @Input() position: Position;
  @Input() date: Date;

  date$: ReplaySubject<Date>;

  forecast$: Observable<OpenWeatherMapForecastItem[][] | undefined>;

  dailyForecast$: Observable<any>;

  constructor(protected _selectors: WeatherSelectors, protected _store: Store) {
    this.date$ = new ReplaySubject<Date>(1);
  }

  ngOnInit(): void {
    if (this.date) {
      this.date$.next(this.date);
    }

    const forecast$ = combineLatest([
      this._store.pipe(
        select(this._selectors.getWeatherContext(this.position)),
        tap(context => {
          if (!context || (!context.loading && !context.loaded)) {
            this._store.dispatch(new actions.GetForecast(this.position));
          }
        }),
        map(context => context && context.loaded),
        filter(loaded => loaded),
        switchMap(() =>
          this._store.pipe(select(this._selectors.getWeather(this.position)))
        )
      ),
      this.date$
    ]);

    this.forecast$ = forecast$.pipe(
      map(([forecast, date]) => this._getForecastForDate(forecast, date)),
      map(forecast =>
        Object.values(
          _groupBy(forecast, item => {
            const date = new Date(item.dt * 1000);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);

            return date.getTime();
          })
        )
      ),
      map(results => (results.length === 0 ? undefined : results))
    );

    this.dailyForecast$ = forecast$.pipe(
      map(([forecast, date]) =>
        getDailyForecast(forecast as WeatherEntity, date)
      )
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.date) {
      const date = changes.date.currentValue;
      this.date$.next(date);
    }
  }

  private _getForecastForDate(
    forecast: WeatherEntity,
    date: Date
  ): OpenWeatherMapForecastItem[] {
    const dateAsTime = date.getTime();

    return forecast.list.filter(item => {
      const dtTime = item.dt * 1000; // Convert to ms
      const prevTime = dateAsTime - 3 * 60 * 60 * 1000; // 3 hours

      return prevTime < dtTime;
    });
  }*/
}
