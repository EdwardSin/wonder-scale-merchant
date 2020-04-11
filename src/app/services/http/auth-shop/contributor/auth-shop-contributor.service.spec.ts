import { TestBed } from '@angular/core/testing';

import { AuthShopContributorService } from './auth-shop-contributor.service';

describe('AuthShopContributorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthShopContributorService = TestBed.get(AuthShopContributorService);
    expect(service).toBeTruthy();
  });
});
