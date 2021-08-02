import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { AwsError } from './error';

@Catch(AwsError)
export class AwsExceptionFilter implements ExceptionFilter {
  public catch(exception: AwsError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(exception.statusCode).json(exception);
  }
}
