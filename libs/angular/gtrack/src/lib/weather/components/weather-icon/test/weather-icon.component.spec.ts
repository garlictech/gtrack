import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherIconComponent } from '@bit/garlictech.angular.gtrack.weather/components';
import { configureTestSuite } from 'ng-bullet';

describe('WeatherIconComponent', () => {
  let component: WeatherIconComponent;
  let fixture: ComponentFixture<WeatherIconComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [WeatherIconComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherIconComponent);
    component = fixture.componentInstance;
    component.icon = 'test';

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should be created', () => {
    const img = fixture.nativeElement.querySelector('img');
    expect(img.src).toEqual('http://openweathermap.org/img/w/test.png');
  });
});
