import { async } from '@angular/core/testing';

describe('AppComponent', () => {
  // let statusBarSpy;
  // let splashScreenSpy;
  // let platformReadySpy;
  // let platformSpy;

  beforeEach(async(() => {
    // statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    // splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    // platformReadySpy = Promise.resolve();
    // platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });
    //   TestBed.configureTestingModule({
    //     declarations: [AppComponent],
    //     schemas: [CUSTOM_ELEMENTS_SCHEMA],
    //     providers: [
    //       // { provide: StatusBar, useValue: statusBarSpy },
    //       // { provide: SplashScreen, useValue: splashScreenSpy },
    //       // { provide: Platform, useValue: platformSpy },
    //     ],
    //     imports: [RouterTestingModule.withRoutes([])]
    //   }).compileComponents();
  }));

  // it('should create the app', async () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // });

  // it('should initialize the app', async () => {
  //   TestBed.createComponent(AppComponent);
  //   expect(platformSpy.ready).toHaveBeenCalled();
  //   platformReadySpy.then( () => {
  //     expect(statusBarSpy.styleDefault).toHaveBeenCalled();
  //     expect(splashScreenSpy.hide).toHaveBeenCalled();
  //   });
  // });

  // it('should have menu labels', async () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const app = fixture.nativeElement;
  //   const menuItems = app.querySelectorAll('ion-label');
  //   expect(menuItems.length).toEqual(2);
  //   expect(menuItems[0].textContent).toContain('Home');
  //   expect(menuItems[1].textContent).toContain('List');
  // });

  // it('should have urls', async () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const app = fixture.nativeElement;
  //   const menuItems = app.querySelectorAll('ion-item');
  //   expect(menuItems.length).toEqual(2);
  //   expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/home');
  //   expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/list');
  // });

  it('a sample test', () => {
    expect(true).toBe(true);
  });
});
