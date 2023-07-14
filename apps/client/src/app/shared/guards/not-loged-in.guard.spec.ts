import { TestBed } from '@angular/core/testing';

import { NotLogedInGuard } from './not-loged-in.guard';

describe('NotLogedInGuard', () => {
  let guard: NotLogedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NotLogedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
