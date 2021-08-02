import { Component } from '@angular/core';
import { MarkerPopupComponent as BaseComponent } from '@bit/garlictech.angular.gtrack.marker-popup/components/marker-popup/marker-popup.component';

@Component({
  selector: 'gtrack-marker-popup',
  templateUrl: './marker-popup.component.html',
  styleUrls: ['./marker-popup.component.scss'],
})
export class MarkerPopupComponent extends BaseComponent {
  showPopup: boolean;

  constructor() {
    super();
    this.showPopup = false;
  }
}
