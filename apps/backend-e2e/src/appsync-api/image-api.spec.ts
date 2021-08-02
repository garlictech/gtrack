import { NestFactory } from '@nestjs/core';
import * as E from 'fp-ts/lib/Either';
import { tap, map, switchMap } from 'rxjs/operators';
import {
  ImageApiService,
  ImageModule,
} from '@bit/garlictech.nestjs.gtrack.image';
import { Image } from '@bit/garlictech.universal.gtrack.graphql-api';

import { imageFixture, getIdOfImage } from './fixtures';

describe('Image graphql integration tests', () => {
  let imageApiService: ImageApiService;

  beforeAll(async () => {
    const app = await NestFactory.createApplicationContext(ImageModule);
    imageApiService = app.get(ImageApiService);
  });

  test('it must be able to CRUD images', done => {
    imageApiService.api
      .delete(getIdOfImage(imageFixture()))
      .pipe(
        switchMap(() =>
          imageApiService.api.createMultipleItems([imageFixture()])
        ),
        tap(result => expect(result).toMatchSnapshot()),
        map(E.fold(done.fail, (res: Image[]) => res[0].id)),
        switchMap((id: string) => imageApiService.api.getById(id)),
        tap(result => expect(result).toMatchSnapshot()),
        map(E.fold(done.fail, (res: Image) => res.id)),
        switchMap((id: string) =>
          imageApiService.api.getMultipleItemsById([id])
        ),
        tap(result => expect(result).toMatchSnapshot()),
        map(E.fold(done.fail, res => res[0].id)),
        switchMap((id: string) =>
          imageApiService.api.update(id, { attributions: 'foobar attribution' })
        ),
        tap(result => expect(result).toMatchSnapshot()),
        map(E.fold(done.fail, (res: Image) => res.id)),
        switchMap((id: string) => imageApiService.api.delete(id)),
        tap(result => expect(result).toMatchSnapshot())
      )
      .subscribe(
        () => done(),
        err => done.fail(err)
      );
  }, 20000);
});
