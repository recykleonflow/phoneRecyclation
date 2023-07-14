import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhoneRecyclationStateComponent } from './phone-recyclation-state.component';

describe('PhoneRecyclationStateComponent', () => {
  let component: PhoneRecyclationStateComponent;
  let fixture: ComponentFixture<PhoneRecyclationStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhoneRecyclationStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneRecyclationStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
