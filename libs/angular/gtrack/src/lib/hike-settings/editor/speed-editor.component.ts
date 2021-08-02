import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { UnitsService } from '@bit/garlictech.angular.gtrack.customer';
import {
  faTachometerAlt,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { IonInput, PopoverController } from '@ionic/angular';

@Component({
  selector: 'gtrack-speed-editor',
  templateUrl: './speed-editor.component.html',
  styleUrls: ['style.scss'],
})
export class SpeedEditorComponent implements OnInit, AfterContentInit {
  speed: number;
  originalValue: number;
  value: number;
  unit: string;
  speedIcon: IconDefinition;
  @ViewChild('input', { static: true }) inputElement: IonInput;

  constructor(
    public popoverController: PopoverController,
    public unitService: UnitsService
  ) {
    this.speedIcon = faTachometerAlt;
  }

  ngOnInit(): void {
    // const converted = this.unitService.convertDistanceInBigUnit(this.speed);
    // this.value = converted.value;
    // this.originalValue = converted.value;
    // this.unit = converted.unit;
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.inputElement.setFocus();
    }, 0);
  }

  onOkClick(): void {
    // if (this.value >= 1) {
    //   this.popoverController.dismiss({
    //     speed: this.unitService.convertBigUnitToMeter(this.value)
    //   });
    // }
  }
}
