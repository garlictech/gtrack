/* eslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { DatePickerComponent } from '../date-picker.component';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DatePickerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should return the current year', () => {
    const year = new Date().getFullYear();
    expect(component.currentYear).toEqual(year);
  });

  it('onChange should handle Date types', () => {
    const date = new Date();
    component.onChange(date);
    expect(component.value).toEqual(date);
  });

  it('onChange should handle string types', () => {
    const date = '2000-01-01';
    component.onChange(date);
    expect(component.value).toEqual(new Date(date));
  });

  it('onChange should handle string types', () => {
    const date = '2000-01-01';
    component.onChange(date);
    expect(component.value).toEqual(new Date(date));
  });

  it('it should handle the string default date', () => {
    const date = '2000-01-01';
    component.defaultDate = date;
    component.ngOnInit();
    expect(component.value).toEqual(new Date(date));
  });

  it('it should handle the Date default date', () => {
    const date = new Date();
    component.defaultDate = date;
    component.ngOnInit();
    expect(component.value).toEqual(date);
  });
});
