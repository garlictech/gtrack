import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  LengthUnit,
  Settings,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { Store } from '@ngrx/store';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { pluck, switchMap, take } from 'rxjs/operators';
import { CustomerSelectors } from '../../store';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import {
  faTachometerAlt,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils';
import {
  FormDescriptor,
  SelectField,
  SharedFormsFeatureModule,
} from '@gtrack/shared/forms/feature';
import { SharedLocalizationDataAccessModule } from '@gtrack/shared/localization/data-access';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HikeCustomerService } from '../../../hike-settings/hike-settings.service';
import { SharedLocalizationFeatureIonicModule } from '@gtrack/shared/localization/feature-ionic';

export const commonSettingsFormFields = {
  lengthUnit: new SelectField({
    label: 'settings.settings.lengthUnit',
    submitOnChange: true,
    selectOptions: [
      {
        label: `settings.lengtUnit.${LengthUnit.metric}`,
        value: LengthUnit.metric,
      },
      {
        label: `settings.lengtUnit.${LengthUnit.imperial}`,
        value: LengthUnit.imperial,
      },
    ],
  }),
};

@UntilDestroy()
@Component({
  selector: 'gtrack-preferences-common',
  templateUrl: './preferences-common.component.html',
  styleUrls: ['./preferences-common.component.scss'],
})
export class CommonPreferencesComponent implements OnInit {
  startTime$: Observable<string>;
  speed$: Observable<number>;
  formDescriptor: FormDescriptor<Settings>;
  calendarIcon: IconDefinition = faCalendarAlt;
  speedIcon: IconDefinition = faTachometerAlt;

  constructor(
    protected _store: Store,
    protected hikeCustomerService: HikeCustomerService
  ) {}

  ngOnInit(): void {
    this.startTime$ = this._store
      .select(CustomerSelectors.selectSettings)
      .pipe(pluck('startTime'));
    this.speed$ = this._store
      .select(CustomerSelectors.selectSettings)
      .pipe(pluck('speed'));

    this.formDescriptor = {
      titleLabel: 'settings.settings.title',
      formDataSelector: CustomerSelectors.selectSettings,
      remoteErrorStateSelector: CustomerSelectors.selectError,
      submit: {
        submitFv: (formGroup: FormGroup) => {
          this.saveSettings(formGroup.value);
        },
      },
      fields: commonSettingsFormFields,
    };
  }

  onStartTimeChange(event: { detail: { value: any } }): void {
    /*if (event && event.detail && event.detail.value) {
      this.saveSettings({ startTime: event.detail.value });
    }*/
  }

  onSpeedClick(): void {
    this.speed$
      .pipe(
        take(1),
        switchMap(speed =>
          this.hikeCustomerService.getNewSpeedFromPopover(speed)
        ),
        untilDestroyed(this)
      )
      .subscribe(averageSpeed => {
        this.saveSettings({ averageSpeed });
      });
  }

  saveSettings(settings: Settings): void {
    //this._store.dispatch(LocalActions.userSettingsSave({ settings }));
  }
}

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    SharedFormsFeatureModule,
    IonicModule,
    SharedLocalizationDataAccessModule,
    SharedLocalizationFeatureIonicModule,
    RouterModule,
    TranslateModule,
    UtilsModule,
  ],
  declarations: [CommonPreferencesComponent],
  exports: [CommonPreferencesComponent],
})
export class CommonPreferencesModule {}
