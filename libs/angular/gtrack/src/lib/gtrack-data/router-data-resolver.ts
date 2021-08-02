import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { CollectionServiceBase } from './collection-service-base';

export class DataRouterResolver<
  CREATE,
  OUTPUT,
  SERVICE extends CollectionServiceBase<CREATE, OUTPUT>
> implements Resolve<OUTPUT> {
  constructor(private readonly service: SERVICE) {}

  resolve(): Observable<OUTPUT> {
    return this.service.resolveByRouteParam();
  }
}
