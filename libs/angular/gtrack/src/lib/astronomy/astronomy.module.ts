import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { MoonphaseIconComponent, SunriseComponent } from './components';
import { AstronomyService } from './services/astronomy';

const DECLARATIONS = [SunriseComponent, MoonphaseIconComponent];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    AngularSvgIconModule,
  ],
  exports: DECLARATIONS,
  declarations: DECLARATIONS,
  providers: [AstronomyService],
})
export class AstronomyModule {}
