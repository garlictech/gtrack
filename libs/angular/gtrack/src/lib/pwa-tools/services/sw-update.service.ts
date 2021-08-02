import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SwUpdateService {
  constructor(
    private readonly swUpdate: SwUpdate,
    private readonly translateService: TranslateService
  ) {}

  start(): void {
    let translatedLabel = '';

    if (this.swUpdate.isEnabled) {
      this.translateService
        .get('common.softwareUpdate')
        .pipe(
          tap(label => (translatedLabel = label)),
          switchMap(() => this.swUpdate.available)
        )
        .subscribe(() => {
          if (confirm(translatedLabel)) {
            window.location.reload();
          }
        });
    }
  }
}
