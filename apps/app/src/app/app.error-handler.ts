import { NGXLogger } from 'ngx-logger';
import { ErrorHandler, Injectable } from '@angular/core';
import { log } from '@app/log';

@Injectable()
export class MobileErrorHandler extends ErrorHandler {
  constructor(private readonly log: NGXLogger) {
    super();
  }

  handleError(error: unknown): void {
    this.log.table(error);
    super.handleError(error);
  }
}
