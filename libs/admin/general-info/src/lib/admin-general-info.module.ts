import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromGeneralInfo from './+state/general-info.reducer';
import { GeneralInfoEffects } from './+state/general-info.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromGeneralInfo.GENERAL_INFO_FEATURE_KEY,
      fromGeneralInfo.reducer
    ),
    EffectsModule.forFeature([GeneralInfoEffects]),
  ],
})
export class AdminGeneralInfoModule {}
