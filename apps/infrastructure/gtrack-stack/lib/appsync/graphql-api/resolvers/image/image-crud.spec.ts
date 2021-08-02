import { Container } from 'inversify';
import * as Joi from 'joi';
import * as fp from 'lodash/fp';
import { diBinder } from './image-di';
import { DI_TYPES } from './image-di-types';

test('hash generator must pick the original url', () => {
  const container = new Container();
  diBinder(container);
  const hashGenerator: any = container.get(DI_TYPES.hashGenerator);
  expect(
    fp.pick(
      ['error', 'value'],
      Joi.validate(
        hashGenerator({
          sourceObject: { objectId: 'OBJECTID', objectType: 'OBJECTTYPE' },
        }),
        Joi.string()
      )
    )
  ).toMatchSnapshot();
});
