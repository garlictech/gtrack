import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-component-busy-indicator',
  template: `
    <div class="w-full h-full text-center">
      <ion-spinner name="bubbles" class="m-auto spinner-dark"></ion-spinner>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentBusyIndicatorComponent {}
