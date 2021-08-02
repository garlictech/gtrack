import { Container } from 'inversify';
import { diBinder } from './poi-di';
import { DI_TYPES } from './poi-di-types';

describe('Test the POI crud operations', () => {
  test('it should be able to inject all the services and create the poi resolvers', () => {
    const container = new Container();
    diBinder(container);
    expect(container.get(DI_TYPES.poiModel)).toBeDefined();
    expect(container.get(DI_TYPES.createPoi)).toBeDefined();
    expect(container.get(DI_TYPES.createPoiValidator)).toBeDefined();
    expect(container.get(DI_TYPES.poiValidator)).toBeDefined();
    expect(container.get(DI_TYPES.updatePoi)).toBeDefined();
  });
});
