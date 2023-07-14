import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateLifecycleComponent } from './state-lifecycle.component';

describe('StateLifecycleComponent', () => {
  let component: StateLifecycleComponent;
  let fixture: ComponentFixture<StateLifecycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StateLifecycleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StateLifecycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
