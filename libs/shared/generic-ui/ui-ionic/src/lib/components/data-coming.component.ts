import { Component } from '@angular/core';

@Component({
  selector: 'gtrack-data-coming',
  template: `
    <div class="w-screen h-screen flex items-center justify-center">
      <div class="text-center font-black text-3xl">
        {{ 'common.loading' | translate }}
      </div>
    </div>
  `,
  styles: [``],
})
export class DataComingComponent {}
