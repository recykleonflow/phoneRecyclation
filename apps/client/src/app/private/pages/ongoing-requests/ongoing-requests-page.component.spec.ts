import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OngoingRequestsPageComponent } from './ongoing-requests-page.component';

describe('OngoingRequestsComponent', () => {
  let component: OngoingRequestsPageComponent;
  let fixture: ComponentFixture<OngoingRequestsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OngoingRequestsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OngoingRequestsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
