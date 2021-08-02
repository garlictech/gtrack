import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import * as O from 'fp-ts/lib/Option';
import { supportedTags } from '@bit/garlictech.universal.gtrack.poi-icons/lib/supported-tags';
import { IconDetails, Icons } from '@bit/garlictech.universal.gtrack.icon-page';
import { pipe } from 'fp-ts/lib/function';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IconService {
  constructor(private readonly translate: TranslateService) {}

  getIconDetails(): Observable<IconDetails[]> {
    return this.translate.get('foo').pipe(
      map(() =>
        pipe(
          Icons.getDetailsOfTags(supportedTags)({
            translate: label => this.translate.instant(label) as string,
          }),
          O.getOrElse(() => [] as IconDetails[])
        )
      )
    );
  }
}
