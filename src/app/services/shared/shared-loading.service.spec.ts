import { TestBed } from '@angular/core/testing';

import { SharedLoadingService } from './shared-loading.service';

describe('SharedLoadingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedLoadingService = TestBed.get(SharedLoadingService);
    expect(service).toBeTruthy();
  });
});
