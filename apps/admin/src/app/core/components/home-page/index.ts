import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HikeEditorPageComponent } from '@admin/pages/hike-editor';
import { HikeEditorPageModule } from '@admin/pages/hike-editor/hike-editor.component';
import { HikeListComponent } from '@admin/features/hike-list/components/hike-list/hike-list.component';
import {
  NbDirectionality,
  NbTreeGridDataService,
  NbTreeGridDataSourceBuilder,
  NbTreeGridFilterService,
  NbTreeGridService,
  NbTreeGridSortService,
} from '@nebular/theme';
import { HikeEditorResolveGuard } from '@admin/features/hike-editor';
@Component({
  selector: 'gtrack-app-home',
  template: ` <h2 style="color:#BCB395">Welcome to gTrack Admin!</h2> `,
})
export class AdminHomeComponent {
  currentDate: Date;
  constructor() {
    this.currentDate = new Date();
  }
}
const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
  },
  {
    path: 'hike/:id',
    component: HikeEditorPageComponent,
    resolve: { hikePreparingHandled: HikeEditorResolveGuard },
  },
  {
    path: 'hikes',
    component: HikeListComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, HikeEditorPageModule],
  declarations: [AdminHomeComponent],
  providers: [
    NbTreeGridDataSourceBuilder,
    NbTreeGridFilterService,
    NbTreeGridFilterService,
    NbTreeGridSortService,
    NbTreeGridService,
    NbTreeGridSortService,
    NbTreeGridDataService,
    NbDirectionality,
  ],
})
export class AdminHomeModule {}
