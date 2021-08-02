import { DynamoDB } from 'aws-sdk';
import { DynamoDBRecord } from 'aws-lambda';
import * as fp from 'lodash/fp';
import { pipe } from 'fp-ts/lib/function';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createDbObjects = (event: any) =>
  pipe(
    event.Records as DynamoDBRecord[],
    fp.map(record => ({
      tableName: record.eventSourceARN?.match(/table\/([a-zA-Z-]*)\//)?.[1],
      object: pipe(
        {
          M:
            record.dynamodb?.[
              record.eventName === 'REMOVE' ? 'OldImage' : 'NewImage'
            ],
        },
        DynamoDB.Converter.output
      ),
      eventName: record.eventName,
    })),
    fp.filter(
      dbObject =>
        !fp.isEmpty(dbObject.tableName) &&
        fp.isObject(dbObject.object) &&
        fp.isString(dbObject.eventName)
    )
  );
