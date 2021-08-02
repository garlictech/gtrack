import { NestFactory } from '@nestjs/core';
import { tap, map, switchMap } from 'rxjs/operators';
import { PoiApiService, PoiModule } from '@bit/garlictech.nestjs.gtrack.poi';

import { poiFixture, getIdOfPoi } from './fixtures';
import * as E from 'fp-ts/lib/Either';
import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';

describe('POI graphql integration tests', () => {
  let poiApiService: PoiApiService;

  beforeAll(async () => {
    const app = await NestFactory.createApplicationContext(PoiModule);
    poiApiService = app.get(PoiApiService);
  });

  test('it must be able to CRUD pois', done => {
    poiApiService.api
      .delete(getIdOfPoi(poiFixture()))
      .pipe(
        switchMap(() => poiApiService.api.add(poiFixture())),
        tap(result => expect(result).toMatchSnapshot('ADD')),
        map(E.fold(done.fail, res => res.id)),
        switchMap((id: string) => poiApiService.api.getById(id)),
        tap(result => expect(result).toMatchSnapshot('GETBYID')),
        map(E.fold(done.fail, res => res.id)),
        switchMap((id: string) => poiApiService.api.getMultipleItemsById([id])),
        tap(result => expect(result).toMatchSnapshot('GETMULTIPLEITEMSBYID')),
        map(E.fold(done.fail, res => res[0].id)),
        switchMap((id: string) =>
          poiApiService.api.update(id, { address: 'foobar addres 2' })
        ),
        tap(result => expect(result).toMatchSnapshot('UPDATE')),
        map(E.fold(done.fail, (res: Poi) => res.id)),
        switchMap((id: string) =>
          poiApiService.api.updateMultipleItems([
            { id, address: 'foobar addres 3' },
          ])
        ),
        tap(result => expect(result).toMatchSnapshot('UPDATEMULTIPLEITEMS')),
        map(E.fold(done.fail, (res: Poi[]) => res[0].id)),
        switchMap((id: string) => poiApiService.api.delete(id)),
        tap(result => expect(result).toMatchSnapshot('DELETE'))
      )
      .subscribe(
        () => done(),
        err => done.fail(err)
      );
  }, 20000);
});
