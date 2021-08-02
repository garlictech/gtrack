import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'trustedUrl',
})
export class TrustedUrlPipe implements PipeTransform {
  constructor(private readonly _sanitizer: DomSanitizer) {}

  transform(value: string): any {
    return this._sanitizer.bypassSecurityTrustUrl(value);
  }
}
