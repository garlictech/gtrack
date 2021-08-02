import { Component, OnInit } from '@angular/core';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'gtrack-start-date-time-editor',
  templateUrl: './start-date-time-editor.component.html',
})
export class StartDateTimeEditorComponent implements OnInit {
  value: string;
  startDate: Date;
  icon: IconDefinition;

  constructor(public popoverController: PopoverController) {
    this.icon = faCalendarAlt;
  }

  ngOnInit(): void {
    this.value = this.startDate.toISOString();
  }

  onChange(): void {
    this.popoverController.dismiss({
      startDate: new Date(this.value),
    });
  }
}
