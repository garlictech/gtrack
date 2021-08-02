import { AbstractValueAccessor } from '../abstract-value-accessor';

describe('Test the abstract value accessor', () => {
  let accessor: AbstractValueAccessor;

  beforeEach(() => {
    accessor = new AbstractValueAccessor();
    jest.spyOn(accessor, 'onChange');
    jest.spyOn(accessor, 'onTouched');
  });

  it('it should set/get the value properly', () => {
    accessor.value = 'foobar';
    expect(accessor.onChange).toHaveBeenCalledWith('foobar');
    expect(accessor.onTouched).toHaveBeenCalled();
    expect(accessor.value).toEqual('foobar');
  });

  it('it should not call the onChange, etc. if the value is unchanged', () => {
    accessor.value = 'foobar';
    jest.resetAllMocks();
    accessor.value = 'foobar';
    expect(accessor.onChange).not.toHaveBeenCalled();
    expect(accessor.onTouched).not.toHaveBeenCalled();
    expect(accessor.value).toEqual('foobar');
  });

  it('doChange should call change if defined', () => {
    // Thsi should simply not fail and do nothing if change is undefined
    accessor.doChange();
    accessor.change = jest.fn();
    accessor.doChange();
    expect(accessor.change).toHaveBeenCalled();
  });

  it('writeValue should change the value', () => {
    accessor.writeValue('foobar');
    expect(accessor.value).toEqual('foobar');
  });

  it('registerOnChange should register the callback', () => {
    const fn = jest.fn();
    accessor.registerOnChange(fn);
    accessor.onChange('foobar');
    expect(fn).toHaveBeenCalledWith('foobar');
  });

  it('registerOnTouched should register the callback', () => {
    const fn = jest.fn();
    accessor.registerOnTouched(fn);
    accessor.onTouched();
    expect(fn).toHaveBeenCalled();
  });
});
