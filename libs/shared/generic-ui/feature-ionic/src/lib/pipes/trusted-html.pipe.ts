import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'trustedHtml',
})
export class TrustedHtmlPipe implements PipeTransform {
  constructor(private readonly _sanitizer: DomSanitizer) {}

  transform(value: string): any {
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
}
