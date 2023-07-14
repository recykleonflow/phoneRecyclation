import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhoneDetailPageComponent } from './phone-detail-page.component';

describe('PhoneDetailComponent', () => {
  let component: PhoneDetailPageComponent;
  let fixture: ComponentFixture<PhoneDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhoneDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
