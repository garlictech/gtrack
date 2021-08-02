import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { SchemaLike } from 'joi';
import { validateSchema } from '@gtrack/universal/gtrack';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: SchemaLike) {}

  public transform<T>(value: unknown): Promise<T> {
    return validateSchema<T>(this.schema)
      .validate(value)
      .pipe(
        catchError(err => {
          return throwError(new BadRequestException(err));
        })
      )
      .toPromise();
  }
}
