import { injectable } from 'inversify';
import { bindNodeCallback } from 'rxjs';
import { map } from 'rxjs/operators';
import { BasicResolverBase } from './basic-resolver-base';

@injectable()
export class BasicUpdateResolver<INPUT, OUTPUT> extends BasicResolverBase<
  INPUT,
  OUTPUT
> {
  constructor(model: Model, joiValidator: (arg: any) => Observable<INPUT>) {
    super(model, joiValidator);
  }

  protected _resolverFv(data: INPUT): Observable<OUTPUT> {
    return bindNodeCallback((cb: any) =>
      this.model.update(data, { expected: { id: { Exists: true } } }, cb)
    )().pipe(map((newData: any) => newData.toPlainObject()));
  }
}
