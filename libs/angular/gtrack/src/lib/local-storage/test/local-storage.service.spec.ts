import { LocalStorageService } from '..';

describe('LocalStorage', () => {
  it('should set item', () => {
    const service = new LocalStorageService();
    service.setItem('test', '1');

    expect(service.getItem('test')).toEqual('1');
  });

  it('should get item', () => {
    const service = new LocalStorageService();
    service.setItem('test', '2');
    expect(service.getItem('test')).toEqual('2');
  });

  it('should delete item', () => {
    const service = new LocalStorageService();
    service.setItem('test', '3');

    expect(service.getItem('test')).toEqual('3');
    service.removeItem('test');

    expect(service.getItem('test')).toBeFalsy();
  });

  it('should remove all', () => {
    const service = new LocalStorageService();
    service.setItem('test', '4');
    service.setItem('test2', '2');
    service.setItem('test3', '3');
    service.clear();

    expect(service.getItem('test')).toBeFalsy();
    expect(service.getItem('test2')).toBeFalsy();
    expect(service.getItem('test3')).toBeFalsy();
  });
});
