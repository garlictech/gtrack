import { NgModule } from '@angular/core';
import { RoleGuard } from './role/role.guard';
import { AdminAuthGuard } from './route-redirect/route-redirect.guard';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [AdminAuthGuard, RoleGuard, AdminAuthGuard],
})
export class GuardsModule {}
