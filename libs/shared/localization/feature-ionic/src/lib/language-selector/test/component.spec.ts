/* eslint:disable:no-unused-variable */
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageService } from '@gtrack/shared/localization/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { configureTestSuite } from 'ng-bullet';
import { LanguageSelectorComponent } from '../';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;

  class MockLanguageService {
    getSupportedLanguages() {
      return ['en_US'];
    }
  }

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageSelectorComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (http: HttpClient) =>
              new TranslateHttpLoader(http, '/assets/i18n', '.json'),
            deps: [HttpClient],
          },
        }),
      ],
      providers: [
        { provide: LanguageService, useClass: MockLanguageService },
        provideMockStore({}),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
