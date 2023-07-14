import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OngoingRequestsTableComponent } from './ongoing-requests-table.component';

describe('OngoingRequestsTableComponent', () => {
  let component: OngoingRequestsTableComponent;
  let fixture: ComponentFixture<OngoingRequestsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OngoingRequestsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OngoingRequestsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
