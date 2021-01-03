import { TestBed } from '@angular/core/testing';

import { AuthCustomerContributorService } from './auth-customer-contributor.service';

describe('AuthCustomerContributorService', () => {
  let service: AuthCustomerContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthCustomerContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
