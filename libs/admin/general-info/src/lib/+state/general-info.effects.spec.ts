import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { GeneralInfoEffects } from './general-info.effects';
import * as GeneralInfoActions from './general-info.actions';

describe('GeneralInfoEffects', () => {
  let actions: Observable<any>;
  let effects: GeneralInfoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        GeneralInfoEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.get(GeneralInfoEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: GeneralInfoActions.init() });

      const expected = hot('-a-|', {
        a: GeneralInfoActions.loadGeneralInfoSuccess({ generalInfo: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
