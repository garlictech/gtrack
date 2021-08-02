import { injectable } from 'inversify';
import { bindNodeCallback } from 'rxjs';
import { map } from 'rxjs/operators';
import { BasicResolverBase } from './basic-resolver-base';

@injectable()
export class BasicCreateResolver<INPUT, OUTPUT> extends BasicResolverBase<
  INPUT,
  OUTPUT
> {
  constructor(
    model: Model,
    joiValidator: (arg: any) => Observable<INPUT>,
    private readonly hashGenerator: (arg: unknown) => string
  ) {
    super(model, joiValidator);
  }

  protected _resolverFv(data: INPUT): Observable<OUTPUT> {
    return bindNodeCallback((cb: any) =>
      this.model.create(
        {
          ...data,
          id: this.hashGenerator(data),
        },
        { overwrite: false },
        cb
      )
    )().pipe(map((newData: any) => newData.toPlainObject()));
  }
}
