import { CommonModule } from '@angular/common';
import { NgModule, Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'gtrack-layout-website',
  template: `
    <div class="site" [ngClass]="{ 'limited-width-page': limitedWidth }">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./layout.component.website.scss'],
})
export class LayoutWebsiteComponent {
  @Input() limitedWidth = false;
}

@NgModule({
  declarations: [LayoutWebsiteComponent],
  imports: [IonicModule, CommonModule],
  exports: [LayoutWebsiteComponent],
  providers: [],
})
export class LayoutWebsiteModule {}
