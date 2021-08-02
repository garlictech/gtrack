import { Logger } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { AwsError } from './error';

type funcType = { promise: () => Promise<any> };

export class AwsServiceBase {
  public async toPromise(awsFunc: funcType): Promise<any> {
    try {
      return awsFunc.promise();
    } catch (error) {
      Logger.debug(`Error happened: ${error}`);
      throw new AwsError(error);
    }
  }

  public toObservable(awsFunc: funcType): Observable<any> {
    return from(this.toPromise(awsFunc));
  }
}
