import { injectable } from 'inversify';
import { ResolverBase } from './resolver-base';

@injectable()
export abstract class BasicResolverBase<INPUT, OUTPUT> extends ResolverBase<
  INPUT,
  OUTPUT
> {
  constructor(
    protected readonly model: Model,
    protected readonly joiValidator: (arg: any) => Observable<INPUT>
  ) {
    super();
  }

  protected _validate(data: unknown): Observable<INPUT> {
    return this.joiValidator(data);
  }
}
