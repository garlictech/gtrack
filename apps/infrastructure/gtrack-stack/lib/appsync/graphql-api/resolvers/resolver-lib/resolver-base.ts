import { injectable } from 'inversify';
import { switchMap, tap } from 'rxjs/operators';
import { Logger } from '../../logger';

@injectable()
export abstract class ResolverBase<INPUT_TYPE, OUTPUT_TYPE>
  implements Resolver {
  public resolve(data?: unknown): Observable<OUTPUT_TYPE> {
    Logger.info(`Validating input data...`);
    Logger.info(`Input Data: ${JSON.stringify(data, null, 2)}`);
    return this._validate(data).pipe(
      tap(() => Logger.info('Input data is valid, executing the resolver')),
      switchMap(validData => this._resolverFv(validData)),
      tap(() => Logger.info('Resolver has been executed successfully'))
    );
  }

  protected abstract _resolverFv(data: INPUT_TYPE): Observable<OUTPUT_TYPE>;

  protected abstract _validate(data: unknown): Observable<INPUT_TYPE>;
}
