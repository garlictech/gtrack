import { Logger } from '@nestjs/common';
import { AWSError } from 'aws-sdk';
import { from, Observable } from 'rxjs';
import { AwsError } from './error';

export class AwsServiceBase {
  public async toPromise(awsFunc: {
    promise: () => Promise<any>;
  }): Promise<any> {
    return awsFunc.promise().catch((error: AWSError) => {
      Logger.debug(`Error happened: ${error}`);
      throw new AwsError(error);
    });
  }

  public toObservable(awsFunc: {
    promise: () => Promise<any>;
  }): Observable<any> {
    return from(this.toPromise(awsFunc));
  }
}
