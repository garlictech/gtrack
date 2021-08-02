import { PoiIconsFp } from '../poi-icons.fp';

test('PoiIconsFp.isKnownIconTag tests', () => {
  expect(PoiIconsFp.isKnownIconTag('generic:asterisco')).toEqual(true);
  expect(PoiIconsFp.isKnownIconTag('foobar')).toEqual(false);
  expect(PoiIconsFp.isKnownIconTag('')).toEqual(false);
  expect(PoiIconsFp.isKnownIconTag(undefined as any)).toEqual(false);
});
