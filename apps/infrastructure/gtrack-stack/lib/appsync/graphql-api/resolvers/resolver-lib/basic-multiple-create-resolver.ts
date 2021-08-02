import { injectable } from 'inversify';
import { bindNodeCallback, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Logger } from '../../logger';
import { BasicResolverBase } from './basic-resolver-base';

@injectable()
export class BasicMultipleCreateResolver<
  INPUT,
  OUTPUT
> extends BasicResolverBase<INPUT[], OUTPUT[]> {
  constructor(
    model: Model,
    joiValidator: (arg: any) => Observable<INPUT[]>,
    private readonly hashGenerator: (arg: unknown) => string
  ) {
    super(model, joiValidator);
  }

  protected _resolverFv(data: INPUT[]): Observable<OUTPUT[]> {
    const dataCreator = (item: INPUT): Observable<OUTPUT> =>
      bindNodeCallback((cb: any) =>
        this.model.create(
          {
            ...item,
            id: this.hashGenerator(item),
          },
          { overwrite: false },
          cb
        )
      )().pipe(
        map((newData: any) => newData.toPlainObject()),
        catchError(error => {
          Logger.error(
            `Error happened during multiple object creation: ${JSON.stringify(
              error,
              null,
              2
            )}`
          );
          return of(undefined);
        })
      );

    return forkJoin(data.map(dataCreator));
  }
}
