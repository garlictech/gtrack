import {
  executeIndexing,
  handler,
} from '../src/lambda/elasticsearch-indexer/elasticsearch-indexer';

import { Image } from '@bit/garlictech.universal.gtrack.graphql-api';
import * as fp from 'lodash/fp';
import { DynamoDB } from 'aws-sdk';
import { Logger } from '@bit/garlictech.nodejs.shared.bunyan-logger';
import { pipe } from 'fp-ts/lib/function';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const docClient = new DynamoDB.DocumentClient();

const params: any = {
  TableName: 'gtrack-staging-images',
};

// docClient.scan(params, onScan);

// eslint-disable-next-line unused-imports/no-unused-vars-ts
async function onScan(err: any, data: DynamoDB.DocumentClient.ScanOutput) {
  if (err) {
    Logger.error(
      `Unable to scan the table. Error JSON: ${JSON.stringify(err, null, 2)}`
    );
  } else {
    await pipe(
      data.Items,
      fp.filter((object: Image) => !object.processed),
      fp.tap(items => Logger.info(`ITEMS to process: ${items.length}`)),
      fp.map(object => ({
        tableName: params.TableName,
        object,
        eventName: 'MODIFY' as any,
      })),
      fp.chunk(10),
      from,
      mergeMap(executeIndexing, 1)
    ).toPromise();

    // continue scanning if we have more items
    if (typeof data.LastEvaluatedKey != 'undefined') {
      Logger.info('Scanning for more...');
      params.ExclusiveStartKey = data.LastEvaluatedKey;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      docClient.scan(params, onScan);
    }
  }
}

const records = [
  {
    eventID: 'cfb2f9c6ecfefdfd08e872187ac3e87e',
    eventName: 'INSERT',
    eventVersion: '1.1',
    eventSource: 'aws:dynamodb',
    awsRegion: 'us-east-1',
    dynamodb: {
      ApproximateCreationDateTime: 1600383915,
      Keys: {
        id: {
          S: 'google-lofasz47',
        },
      },
      NewImage: {
        createdAt: {
          S: '2020-09-17T23:05:14.946Z',
        },
        thumbnail: {
          M: {
            width: {
              N: '2',
            },
            url: {
              S: 'http://a.b',
            },
            height: {
              N: '3',
            },
          },
        },
        original: {
          M: {
            width: {
              N: '2',
            },
            url: {
              S:
                'https://syndlab.com/files/view/5db9b150252346nbDR1gKP3OYNuwBhXsHJerdToc5I0SMLfk7qlv951730.jpeg',
            },
            height: {
              N: '3',
            },
          },
        },
        lon: {
          N: '18.943822',
        },
        sourceObject: {
          M: {
            objectId: {
              S: 'lofasz47',
            },
            objectType: {
              S: 'google',
            },
          },
        },
        id: {
          S: 'google-lofasz47',
        },
        card: {
          M: {
            width: {
              N: '2',
            },
            url: {
              S:
                'https://fw.photos/O__DjKi6xYYAXTD1yShIRUayaHs=/1600x900/https%3A%2F%2Fwww.paneuropaipiknik.hu%2Fuploads%2Fcover%2Fdsc-0494-2-5efee30aaf718.JPG',
            },
            height: {
              N: '3',
            },
          },
        },
        lat: {
          N: '47.505135',
        },
      },
      SequenceNumber: '48001900000000022312502824',
      SizeBytes: 414,
      StreamViewType: 'NEW_AND_OLD_IMAGES',
    },
    eventSourceARN:
      'arn:aws:dynamodb:us-east-1:697486207432:table/gtrack-staging-images/stream/2020-09-08T11:35:57.416',
  },
];

const x = async () => {
  return await handler({ Records: records }, {} as any, {} as any);
};

x();
