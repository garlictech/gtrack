import { Data, Params } from '@angular/router';

export const featureName = 'features.common.router';

export interface RouterStateDesc {
  url: string;
  queryParams: Params;
  params: Params;
  data: Data;
}
