import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot, Scheduler } from 'jest-marbles';
import { configureTestSuite } from 'ng-bullet';
import { Observable } from 'rxjs';
import * as fromActions from '../actions';
import { Effects } from '../effects';

describe('Router effect tests', () => {
  class MockLocation {
    back = jest.fn();
    forward = jest.fn();
  }

  class MockRouter {
    navigateByUrl = jest.fn();
    navigate = jest.fn();
  }

  let effects: Effects;
  let actions: Observable<any>;
  let router: Router;
  let location: Location;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Location, useClass: MockLocation },
        { provide: Router, useClass: MockRouter },
        Effects,
        provideMockActions(() => actions),
      ],
    });
  });

  beforeEach(() => {
    effects = TestBed.inject(Effects);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  it('navigateGo$ should execute the navigation when called with array', () => {
    actions = hot('--a-', { a: new fromActions.Go(['path'], 'extras' as any) });
    const expected = cold('--a', {
      a: {
        path: ['path'],
        extras: 'extras',
        type: '[Router] Go',
      },
    });
    expect(effects.navigateGo$).toBeObservable(expected);
    Scheduler.get().flush();
    expect(router.navigate).toHaveBeenCalledWith(['path'], 'extras');
  });

  it('navigateGo$ should execute the navigation when called with string', () => {
    actions = hot('--a-', { a: new fromActions.Go('path', 'extras' as any) });
    const expected = cold('--a', {
      a: {
        path: 'path',
        extras: 'extras',
        type: '[Router] Go',
      },
    });
    expect(effects.navigateGo$).toBeObservable(expected);
    Scheduler.get().flush();
    expect(router.navigateByUrl).toHaveBeenCalledWith('path', 'extras');
  });

  it('navigateReplace$ should execute the navigation when called with string', () => {
    actions = hot('--a-', {
      a: new fromActions.Replace('path' as any, {} as any),
    });
    const expected = cold('--a', {
      a: {
        path: 'path',
        extras: { replaceUrl: true },
        type: '[Router] Replace',
      },
    });
    expect(effects.navigateReplace$).toBeObservable(expected);
    Scheduler.get().flush();
    expect(router.navigateByUrl).toHaveBeenCalledWith('path', {
      replaceUrl: true,
    });
  });

  it('navigateReplace$ should execute the navigation when called with array', () => {
    actions = hot('--a-', { a: new fromActions.Replace(['path'], {} as any) });
    const expected = cold('--a', {
      a: {
        path: ['path'],
        extras: { replaceUrl: true },
        type: '[Router] Replace',
      },
    });
    expect(effects.navigateReplace$).toBeObservable(expected);
    Scheduler.get().flush();
    expect(router.navigate).toHaveBeenCalledWith(['path'], {
      replaceUrl: true,
    });
  });

  it('navigateBack$ should execute the navigation', () => {
    actions = hot('--a-', { a: new fromActions.Back() });
    const expected = cold('--a', { a: { type: '[Router] Back' } });
    expect(effects.navigateBack$).toBeObservable(expected);
    Scheduler.get().flush();
    expect(location.back).toHaveBeenCalled();
  });

  it('navigateForward$ should execute the navigation', () => {
    actions = hot('--a-', { a: new fromActions.Forward() });
    const expected = cold('--a', { a: { type: '[Router] Forward' } });
    expect(effects.navigateForward$).toBeObservable(expected);
    Scheduler.get().flush();
    expect(location.forward).toHaveBeenCalled();
  });
});
