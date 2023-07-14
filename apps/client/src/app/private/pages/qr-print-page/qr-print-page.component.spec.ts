import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrPrintPage } from './qr-print-page.component';

describe('AddedDeviceSuccessPageComponent', () => {
  let component: QrPrintPage;
  let fixture: ComponentFixture<QrPrintPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrPrintPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrPrintPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
