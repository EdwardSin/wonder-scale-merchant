import { TestBed } from '@angular/core/testing';

import { StoreAuthorizationService } from './store-authorization.service';

describe('StoreAuthorizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoreAuthorizationService = TestBed.get(StoreAuthorizationService);
    expect(service).toBeTruthy();
  });
});
