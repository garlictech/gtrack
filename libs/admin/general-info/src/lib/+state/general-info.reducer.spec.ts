import { GeneralInfoEntity } from './general-info.models';
import * as GeneralInfoActions from './general-info.actions';
import { State, initialState, reducer } from './general-info.reducer';

describe('GeneralInfo Reducer', () => {
  const createGeneralInfoEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as GeneralInfoEntity);

  beforeEach(() => {});

  describe('valid GeneralInfo actions', () => {
    it('loadGeneralInfoSuccess should return set the list of known GeneralInfo', () => {
      const generalInfo = [
        createGeneralInfoEntity('PRODUCT-AAA'),
        createGeneralInfoEntity('PRODUCT-zzz'),
      ];
      const action = GeneralInfoActions.loadGeneralInfoSuccess({ generalInfo });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
