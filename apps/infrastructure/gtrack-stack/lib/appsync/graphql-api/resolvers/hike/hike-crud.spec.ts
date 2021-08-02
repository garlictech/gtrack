import 'reflect-metadata';
import { Container } from 'inversify';
import * as _ from 'lodash';
import { diBinder } from './hike-di';
import { DI_TYPES } from './hike-di-types';

describe('Test the Hike crud operations', () => {
  test('it should be able to inject all the services and create the Hike resolvers', () => {
    const container = new Container();
    diBinder(container);

    _.keys(DI_TYPES).forEach((key: string) => {
      expect(container.get(DI_TYPES[key])).toBeDefined();
    });
  });
});
