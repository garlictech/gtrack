import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AuthStartComponent } from './auth-start.component';
import { StoreModule } from '@ngrx/store';

describe('AuthStartComponent', () => {
  let component: AuthStartComponent;
  let fixture: ComponentFixture<AuthStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule, StoreModule.forRoot({})],
      declarations: [AuthStartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
