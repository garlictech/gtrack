import { Component, Input } from '@angular/core';

@Component({
  // eslint:disable-next-line:component-selector
  selector: '[garlictechSpinner]',
  exportAs: 'garlictechSpinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.scss'],
})
export class SpinnerComponent {
  @Input() fullSize: boolean;
  showSpinner: boolean;
  constructor() {
    this.showSpinner = false;
  }

  @Input('garlictechSpinner')
  set garlictechSpinner(val: boolean) {
    this.showSpinner = val;
  }
}
