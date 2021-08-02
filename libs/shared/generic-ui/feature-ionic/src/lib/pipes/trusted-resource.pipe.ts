import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'trustedResource',
})
export class TrustedResourcePipe implements PipeTransform {
  constructor(private readonly _sanitizer: DomSanitizer) {}

  transform(value: string): any {
    return this._sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
