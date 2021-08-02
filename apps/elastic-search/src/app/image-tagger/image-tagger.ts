import { Logger } from '@bit/garlictech.nodejs.shared.bunyan-logger';
import * as AWS from 'aws-sdk';
import { Rekognition } from 'aws-sdk';
import axios from 'axios';
import * as fp from 'lodash/fp';
import { Observable, of } from 'rxjs';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { pipe, flow, Lazy } from 'fp-ts/lib/function';
import { tap } from 'rxjs/operators';

const promiseToObservableEither = <A>(task: Lazy<Promise<A>>) =>
  pipe(TE.tryCatch(task, E.toError), OE.fromTaskEither);

const {
  TAGGER_AWS_ACCESS_KEY,
  TAGGER_AWS_SECRET_ACCESS_KEY,
  TAGGER_AWS_REGION,
} = process.env;

AWS.config.update({
  accessKeyId: TAGGER_AWS_ACCESS_KEY,
  secretAccessKey: TAGGER_AWS_SECRET_ACCESS_KEY,
  region: TAGGER_AWS_REGION,
});

const rekognition = new AWS.Rekognition({
  apiVersion: '2016-06-27',
});

const defaultMaxLabels = 10;
const defaultMinConfidence = 80;

export const tagImage = (
  imageUrl: string,
  maxLabels = defaultMaxLabels,
  minConfidence = defaultMinConfidence
): Observable<boolean> =>
  pipe(
    imageUrl,
    fp.tap(() => Logger.info(`Tagging image at ${imageUrl}`)),
    getBase64BufferFromURL,
    OE.chain(bytes =>
      flow(
        isRelevantImage(maxLabels, minConfidence),
        OE.chain(() => isImageUnsafe(minConfidence)(bytes)),
        OE.chain(() => isFaceInImage(minConfidence)(bytes))
      )(bytes)
    ),
    OE.fold(
      () => of(false),
      () => of(true)
    ),
    tap((isGood: boolean) =>
      Logger.info(`Image at ${imageUrl} is ${isGood ? 'GOOD' : 'BAD'}`)
    )
  );

const getBase64BufferFromURL = (
  url: string
): OE.ObservableEither<any, Buffer> =>
  pipe(
    () =>
      axios.get(url, {
        responseType: 'arraybuffer',
      }),
    promiseToObservableEither,
    OE.map(response => Buffer.from(response.data, 'base64'))
  );

const isRelevantImage = (maxLabels: number, minConfidence: number) => (
  bytes: Buffer
): OE.ObservableEither<any, true> =>
  pipe(
    () =>
      rekognition
        .detectLabels({
          Image: {
            Bytes: bytes,
          },
          MaxLabels: maxLabels,
          MinConfidence: minConfidence,
        })
        .promise(),
    promiseToObservableEither,
    OE.chain(
      flow(
        (res: Rekognition.DetectLabelsResponse) => res.Labels,
        fp.tap(labels =>
          Logger.debug(
            `Found labels: ${JSON.stringify(fp.map('Name', labels), null, 2)}`
          )
        ),
        fp.some(
          res =>
            !!res.Name &&
            !!res.Confidence &&
            ['Nature', 'Outdoors', 'Vegetation'].includes(res.Name)
        ),
        fp.tap(isRelevant =>
          Logger.info(`--- detected relevance: ${isRelevant}`)
        ),
        isRelevant => (isRelevant ? OE.right(true) : OE.left(false))
      )
    )
  );

const isImageUnsafe = (minConfidence: number) => (
  bytes: Buffer
): OE.ObservableEither<any, boolean> =>
  pipe(
    () =>
      rekognition
        .detectModerationLabels({
          Image: {
            Bytes: bytes,
          },
          MinConfidence: minConfidence,
        })
        .promise(),
    promiseToObservableEither,
    OE.chain(
      flow(
        (res: Rekognition.DetectModerationLabelsResponse) =>
          res.ModerationLabels,
        fp.tap(reasons =>
          Logger.debug(
            `Found safety problems: ${JSON.stringify(
              fp.map('Name', reasons),
              null,
              2
            )}`
          )
        ),
        fp.filter(res => !!res.Name && !!res.Confidence),
        fp.isEmpty,
        fp.tap(isOk => Logger.info(`--- detected safe image: ${isOk}`)),
        isOk => (isOk ? OE.right(true) : OE.left(false))
      )
    )
  );

const isFaceInImage = (minConfidence: number) => (
  bytes: Buffer
): OE.ObservableEither<any, true> =>
  pipe(
    () =>
      rekognition
        .detectFaces({
          Image: {
            Bytes: bytes,
          },
          Attributes: ['DEFAULT'],
        })
        .promise(),
    promiseToObservableEither,
    OE.chain(
      fp.flow(
        (res: Rekognition.DetectFacesResponse) => res.FaceDetails,
        fp.map((item: Rekognition.FaceDetail) => item.Confidence),
        fp.some((confidence: number) => confidence > minConfidence),
        fp.tap(isFaceFound =>
          Logger.info(`--- detected face in image: ${isFaceFound}`)
        ),
        isFaceFound => (isFaceFound ? OE.left(false) : OE.right(true))
      )
    )
  );
