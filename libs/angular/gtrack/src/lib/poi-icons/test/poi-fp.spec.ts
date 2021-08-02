import { PoiIconsFp } from '@bit/garlictech.universal.gtrack.poi-icons';

const fixture1 = 'amenity:casino';
const fixture2 = 'natural:wood';

test('PoiIconsFp.getIcondescriptor must work', () => {
  expect(PoiIconsFp.getIcon(fixture1)).toMatchSnapshot('1');
  expect(PoiIconsFp.getIcon('')).toMatchSnapshot('2');
  expect(PoiIconsFp.getIcon('amenity:')).toMatchSnapshot('3');
  expect(PoiIconsFp.getIcon(':wood')).toMatchSnapshot('4');
  expect(PoiIconsFp.getIcon(':')).toMatchSnapshot('5');
  expect(PoiIconsFp.getIcon('amenity')).toMatchSnapshot('6');
  expect(PoiIconsFp.getIcons([fixture1, fixture2])).toMatchSnapshot('7');
  expect(PoiIconsFp.getIcons([fixture1, ''])).toMatchSnapshot('8');
});
