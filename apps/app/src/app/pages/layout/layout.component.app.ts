import { CommonModule } from '@angular/common';
import { NgModule, Component } from '@angular/core';

@Component({
  selector: 'gtrack-layout-app',
  template: ` <ng-content></ng-content> `,
})
export class LayoutAppComponent {}

@NgModule({
  declarations: [LayoutAppComponent],
  imports: [CommonModule],
  exports: [LayoutAppComponent],
  providers: [],
})
export class LayoutAppModule {}
