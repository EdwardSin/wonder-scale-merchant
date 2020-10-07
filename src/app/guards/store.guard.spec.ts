import { TestBed } from '@angular/core/testing';

import { StoreGuard } from './store.guard';

describe('StoreGuard', () => {
  let guard: StoreGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StoreGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
