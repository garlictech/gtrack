import { tap } from 'rxjs/operators';
import { getCityFromGoogle } from '../../reverse-geocoding.service';

describe('Reverse geocoding service tests', () => {
  it('Get addres of a point with the google map service', done => {
    getCityFromGoogle({ lat: 48, lon: 19 })
      .pipe(tap(res => expect(res).toMatchSnapshot()))
      .subscribe(() => done());
  });
});
