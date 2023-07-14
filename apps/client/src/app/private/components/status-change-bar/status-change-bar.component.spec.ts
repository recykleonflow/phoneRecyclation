import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusChangeBarComponent } from './status-change-bar.component';

describe('StatusChangeBarComponent', () => {
  let component: StatusChangeBarComponent;
  let fixture: ComponentFixture<StatusChangeBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusChangeBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusChangeBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
