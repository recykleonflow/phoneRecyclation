import { TestBed } from '@angular/core/testing';

import { DrawerItemsService } from './drawer-items.service';

describe('DrawerItemsService', () => {
  let service: DrawerItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawerItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
