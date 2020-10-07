import { TestBed } from '@angular/core/testing';

import { AuthSaleContributorService } from './auth-sale-contributor.service';

describe('AuthSaleContributorService', () => {
  let service: AuthSaleContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthSaleContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
