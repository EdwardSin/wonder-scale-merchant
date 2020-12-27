import { TestBed } from '@angular/core/testing';

import { AuthInvoiceConfigurationContributorService } from './auth-invoice-configuration-contributor.service';

describe('AuthInvoiceConfigurationContributorService', () => {
  let service: AuthInvoiceConfigurationContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthInvoiceConfigurationContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
