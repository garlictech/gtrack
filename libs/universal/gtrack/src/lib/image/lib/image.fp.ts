import {
  Image,
  CreateImageInput
} from '@bit/garlictech.universal.gtrack.graphql-api';
import * as fp from 'lodash/fp';
import { from, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

export class ImageFp {
  static randomImageBackground(
    imageProvider$: Observable<Image[]>
  ): Observable<{
    thumbnailUrl: string;
    fullsizeUrl: string;
  }> {
    return imageProvider$.pipe(
      switchMap(() => imageProvider$),
      filter(images => fp.isArray(images) && !fp.isEmpty(images)),
      map(
        fp.flow(
          fp.map((image: Image) => ({
            fullsizeUrl: image.card.url,
            thumbnailUrl: image.thumbnail.url
          }))
        )
      ),
      filter(images => fp.isArray(images) && !fp.isEmpty(images)),
      switchMap(urls => from(fp.shuffle(urls)))
    );
  }

  static randomStaticImageBackground(): string {
    const startNum = fp.random(1, 10);
    return `/assets/img/cards/mountain-silhouettes-${startNum}.png`;
  }

  static generateId(image: CreateImageInput): string {
    return `${fp.get('sourceObject.objectType', image)}-${fp.get(
      'sourceObject.objectId',
      image
    )}`;
  }
}
