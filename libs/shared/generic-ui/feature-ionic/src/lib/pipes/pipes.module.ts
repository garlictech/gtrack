import { NgModule } from '@angular/core';
import { ObjectToArrayPipe } from './object-to-array.pipe';
import { OrderByPipe } from './order-by';
import { TrustedHtmlPipe } from './trusted-html.pipe';
import { TrustedResourcePipe } from './trusted-resource.pipe';
import { TrustedUrlPipe } from './trusted-url.pipe';

const COMPONENTS = [
  TrustedHtmlPipe,
  TrustedUrlPipe,
  TrustedResourcePipe,
  ObjectToArrayPipe,
  OrderByPipe,
];

@NgModule({
  exports: [...COMPONENTS],
  declarations: [COMPONENTS],
})
export class PipesModule {}
