import { featureName, RouterStateDesc } from '../state';

export const createFeatureState = ({
  url = 'url',
  queryParams = 'queryParams' as any,
  params = 'params' as any,
  data = 'data' as any,
} = {}): RouterStateDesc => ({
  url,
  queryParams,
  params,
  data,
});

export const createState = (stateParams?) => {
  const res: any = {};
  res[featureName] = { state: createFeatureState(stateParams) };

  return res;
};
