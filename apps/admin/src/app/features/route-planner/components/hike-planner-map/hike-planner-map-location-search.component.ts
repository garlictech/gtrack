import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { NgModule, Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { LocationSearchComponent } from '@bit/garlictech.angular.gtrack.search-ionic';
import { NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@UntilDestroy()
@Component({
  selector: 'gtrack-hike-planner-location-search',
  template: `
    <div class="mb-4">
      <nb-form-field>
        <nb-icon nbPrefix icon="globe-outline" pack="eva"></nb-icon>
        <input
          nbInput
          #search
          placeholder="Search location"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="off"
          onfocus="this.value=''"
        />
      </nb-form-field>
    </div>
  `,
  styleUrls: ['./gtrack-hike-planner-location-search.scss'],
})
export class HikePlannerLocationSearchComponent extends LocationSearchComponent {}

@NgModule({
  declarations: [HikePlannerLocationSearchComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NbInputModule,
    NbFormFieldModule,
    NbIconModule,
    NbEvaIconsModule,
  ],
  exports: [HikePlannerLocationSearchComponent],
  providers: [],
})
export class HikePlannerLocationSearchComponentModule {}
