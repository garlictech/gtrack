import { GeneralInfoEntity } from './general-info.models';
import {
  State,
  generalInfoAdapter,
  initialState,
} from './general-info.reducer';
import * as GeneralInfoSelectors from './general-info.selectors';

describe('GeneralInfo Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getGeneralInfoId = it => it['id'];
  const createGeneralInfoEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as GeneralInfoEntity);

  let state;

  beforeEach(() => {
    state = {
      generalInfo: generalInfoAdapter.setAll(
        [
          createGeneralInfoEntity('PRODUCT-AAA'),
          createGeneralInfoEntity('PRODUCT-BBB'),
          createGeneralInfoEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('GeneralInfo Selectors', () => {
    it('getAllGeneralInfo() should return the list of GeneralInfo', () => {
      const results = GeneralInfoSelectors.getAllGeneralInfo(state);
      const selId = getGeneralInfoId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = GeneralInfoSelectors.getSelected(state);
      const selId = getGeneralInfoId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getGeneralInfoLoaded() should return the current 'loaded' status", () => {
      const result = GeneralInfoSelectors.getGeneralInfoLoaded(state);

      expect(result).toBe(true);
    });

    it("getGeneralInfoError() should return the current 'error' state", () => {
      const result = GeneralInfoSelectors.getGeneralInfoError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
