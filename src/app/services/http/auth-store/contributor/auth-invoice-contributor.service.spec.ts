import { TestBed } from '@angular/core/testing';

import { AuthInvoiceContributorService } from './auth-invoice-contributor.service';

describe('AuthInvoiceContributorService', () => {
  let service: AuthInvoiceContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthInvoiceContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
