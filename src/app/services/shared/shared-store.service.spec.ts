import { TestBed } from '@angular/core/testing';

import { SharedStoreService } from './shared-store.service';

describe('SharedStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedStoreService = TestBed.get(SharedStoreService);
    expect(service).toBeTruthy();
  });
});
