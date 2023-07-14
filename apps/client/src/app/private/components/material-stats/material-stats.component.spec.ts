import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialStatsComponent } from './material-stats.component';

describe('MaterialStatsComponent', () => {
  let component: MaterialStatsComponent;
  let fixture: ComponentFixture<MaterialStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialStatsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
