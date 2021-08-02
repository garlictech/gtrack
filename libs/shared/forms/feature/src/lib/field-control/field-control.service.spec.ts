import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { FieldControlService } from './field-control.service';

describe('FieldControlService', () => {
  let service: FieldControlService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [FieldControlService],
    });
  });

  beforeEach(() => {
    service = new FieldControlService();
  });

  afterEach(() => {});

  it('FieldControlService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should check toFormGroup in FieldControlService', () => {
    const testFormFields = [
      { controlType: 'group', disabled: false },
      { controlType: 'group', disabled: true },
      { controlType: 'section', disabled: false },
      { controlType: 'section', disabled: true },
      { controlType: 'other', disabled: false },
      { controlType: 'other', disabled: true },
    ];
    expect(service.toFormGroup(testFormFields, [])).not.toBeNull();
  });
});
