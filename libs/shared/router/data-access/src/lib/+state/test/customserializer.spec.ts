import { CustomSerializer } from '../custom-serializer';

describe('Test the custom serializer', () => {
  const serializer = new CustomSerializer();

  const routerState: any = {
    url: 'fooUrl',
    root: {
      queryParams: { foo: 'querybar' },
      url: 'rootUrl',
      params: { foo: 'paramsbar' },
      data: { foo: 'databar' },
    },
  };

  it('would serialize the router state', () => {
    expect(serializer.serialize(routerState)).toMatchSnapshot();
  });

  it('would serialize the router state with firstChild', () => {
    const _routerState = { ...routerState };
    _routerState.root.firstChild = {
      ...routerState.root,
      params: { foo: 'otherparam' },
    };
    expect(serializer.serialize(_routerState)).toMatchSnapshot();
  });
});
