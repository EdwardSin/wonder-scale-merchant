import { TestBed } from '@angular/core/testing';

import { AuthStoreContributorService } from './auth-store-contributor.service';

describe('AuthStoreContributorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthStoreContributorService = TestBed.get(AuthStoreContributorService);
    expect(service).toBeTruthy();
  });
});
